import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, link } = body;

    // Google Apps Script Web App URL (User needs to replace this after deploying the GAS code)
    const GAS_URL = process.env.GAS_WEBAPP_URL || '';

    if (!GAS_URL) {
      return NextResponse.json({ error: 'GAS URL is not configured' }, { status: 500 });
    }

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, link }),
      redirect: 'follow', // Ensure redirects are followed
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return NextResponse.json(result);
    } else {
      const text = await response.text();
      console.error('GAS returned non-JSON response:', text.substring(0, 200));
      
      // If it's a success but returned as text/html (common with GAS sometimes)
      if (text.includes('success')) {
        return NextResponse.json({ status: 'success' });
      }
      
      return NextResponse.json({ error: 'GAS returned unexpected content' }, { status: 500 });
    }
  } catch (error) {
    console.error('Save to sheets error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
