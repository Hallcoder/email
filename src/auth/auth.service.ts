import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
    
    this.googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
    });
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async googleLoginWithToken(idToken: string) {
    try {
      // Verify the Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        throw new Error('Invalid Google token');
      }

      // Create or update Firebase user
      const firebaseUser = await admin.auth().createUser({
        email: payload.email,
        displayName: payload.name,
        photoURL: payload.picture,
        emailVerified: payload.email_verified,
      }).catch(async (error) => {
        if (error.code === 'auth/email-already-exists') {
          // If user exists, get the user
          return admin.auth().getUserByEmail(payload.email);
        }
        throw error;
      });

      // Create custom token for the client
      const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

      return {
        user: firebaseUser,
        customToken,
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
} 