import { NextResponse } from "next/server";

const laporan = [
  {
    id: 1,
    name: "Laporan 1",
    description: "Laporan 1 description",
  },
  {
    id: 2,
    name: "Laporan 2",
    description: "Laporan 2 description",
  },
];

export async function GET() {
  return NextResponse.json(laporan);
}
