import { NextResponse } from 'next/server';

export async function POST() {
  // Return a DAS-like structure for demo rendering
  const items = [
    {
      id: 'demo-asset-1',
      content: { json_uri: '', metadata: { name: 'APEC Dual-Degree – Nguyen Van A', symbol: 'APEC-DD', attributes: [] } },
      grouping: [{ group_key: 'collection', group_value: 'DEMO_COLLECTION' }],
    },
    {
      id: 'demo-asset-2',
      content: { json_uri: '', metadata: { name: 'Negotiation – Completed', symbol: 'APEC-SKILL', attributes: [] } },
      grouping: [{ group_key: 'collection', group_value: 'DEMO_COLLECTION' }],
    },
    {
      id: 'demo-asset-3',
      content: { json_uri: '', metadata: { name: 'Entrepreneurship Capstone', symbol: 'APEC-CAP', attributes: [] } },
      grouping: [{ group_key: 'collection', group_value: 'DEMO_COLLECTION' }],
    },
  ];
  return NextResponse.json({ result: { items } });
}



