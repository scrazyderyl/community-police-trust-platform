import { VALIDATION_SCHEMA as STANDARD_ACCOUNT_VALIDATION_SCHEMA } from '@/lib/standard_account_schema';
import { VALIDATION_SCHEMA as CODE_ACCOUNT_VALIDATION_SCHEMA } from '@/lib/code_account_schema';
import { NextResponse } from 'next/server';
import { auth, db } from '@/firebaseConfig';
import { signInWithCustomToken } from 'firebase/auth';

async function createStandardAccount(data) {
  if (!await STANDARD_ACCOUNT_VALIDATION_SCHEMA.isValid(data)) {
    return new NextResponse(null, { status: 400 });
  }

  const isEmail = data.username.includes('@');

  try {
    if (isEmail) {

    } else {

    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

async function createCodeAccount(data) {
  if (!await CODE_ACCOUNT_VALIDATION_SCHEMA.isValid(data)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
  
  return new NextResponse(null, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();

    switch (body.type) {
      case 'standard':
        return await createStandardAccount(body.data);
      case 'code':
        return await createCodeAccount(body.data);
      default:
        return new NextResponse(null, { status: 400 });
    }
  } catch (err) {
    return new NextResponse(null, { status: 400 });
  }
}