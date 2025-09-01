'use client';
import { getAuth } from 'firebase/auth';
import { app } from './app';
if (typeof window === 'undefined') throw new Error('clientAuth nur im Browser');
export const auth = getAuth(app);