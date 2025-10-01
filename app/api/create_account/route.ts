import { VALIDATION_SCHEMA as STANDARD_ACCOUNT_VALIDATION_SCHEMA } from '@/lib/standard_account_schema';
import { VALIDATION_SCHEMA as CODE_ACCOUNT_VALIDATION_SCHEMA } from '@/lib/code_account_schema';
import { NextResponse } from 'next/server';
import { createEmailAccount, createUsernameAccount, login } from '@/lib/auth';

async function createStandardAccount(data) {
  // Data validation
  if (!await STANDARD_ACCOUNT_VALIDATION_SCHEMA.isValid(data)) {
    return new NextResponse(null, { status: 400 });
  }

  const isEmail = data.identifier.includes('@');

  try {
    const accountId = await (isEmail ? createEmailAccount(data.identifier, data.password) : createUsernameAccount(data.identifier, data.password));
    
    if (accountId) {
      // Success
      const customToken = await login(accountId);
      return NextResponse.json(customToken, { status: 200 });
    } else {
      // Identifier already in use
      return new NextResponse(null, { status: 409 });
    }
  } catch (error) {
    // Server error
    return new NextResponse(null, { status: 500 });
  }
}

async function createCodeAccount(data) {
  // Data validation
  if (!await CODE_ACCOUNT_VALIDATION_SCHEMA.isValid(data)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    // Not implemented
    return new NextResponse(null, { status: 501 });
  } catch (error) {
    // Server error
    return new NextResponse(null, { status: 500 });
  } 
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body) {
      return new NextResponse(null, { status: 400 });
    }

    switch (body.type) {
      case 'standard':
        return await createStandardAccount(body.data);
      case 'code':
        return await createCodeAccount(body.data);
      default:
        return new NextResponse(null, { status: 400 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}