import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    message: 'Test route working',
    id: params.id
  })
}
