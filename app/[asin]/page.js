import Navbar from '../../components/navbar';
import React from 'react';
import Image from 'next/image';
import DisplayChart from '../../components/DisplayChart';
import { MongoClient } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'amazon';

export default async function Page({ params }) {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('prices');

  // const data = [
  //     {
  //       label: 'Product',
  //       data: [
  //         {
  //           date: 23,
  //           price: 12,
  //         }
  //       ],
  //     },
  //   ];

  let asin = params.asin;

  const data = await collection
    .aggregate([
      {
        $match: {
          asin: asin.toUpperCase(), // Convert to uppercase to match the case
        },
      },
      {
        $sort: {
          time: 1,
        },
      },
      {
        $group: {
          _id: '$asin',
          data: {
            $push: {
              time: { $dayOfMonth: '$time' },
              price: { $toInt: '$priceInt' }, // Convert priceInt to integer
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          label: 'Product',
          data: '$data',
        },
      },
    ])
    .toArray();

  console.log(data);

  return (
    <>
      <div>
        <Navbar />
        <div className="container mx-auto p-9">
          Track Price for: {params.asin}
          <DisplayChart data={data} />
        </div>
      </div>
    </>
  );
}
