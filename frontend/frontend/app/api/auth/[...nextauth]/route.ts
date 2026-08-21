// TODO: implement if/when NextAuth is used alongside Supabase auth.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Not implemented — using Supabase auth.' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: 'Not implemented — using Supabase auth.' }, { status: 501 });
}
