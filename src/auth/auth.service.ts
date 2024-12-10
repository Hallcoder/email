import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class AuthService {
  async googleLoginWithToken(idToken: string) {
    try {
      // Verify the ID token
      const decodedToken = await auth().verifyIdToken(idToken);
      
      // Get or create the user
      const user = await auth().getUser(decodedToken.uid);
      
      // Create a custom token if needed
      const customToken = await auth().createCustomToken(user.uid);
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
        customToken,
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}