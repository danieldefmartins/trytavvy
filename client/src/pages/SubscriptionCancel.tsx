/**
 * Subscription Cancel Page
 * 
 * Shown when user cancels Stripe checkout
 */

import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function SubscriptionCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-gray-600 dark:text-gray-400" />
          </div>
          <CardTitle className="text-2xl">Subscription Cancelled</CardTitle>
          <CardDescription>
            Your payment was not processed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No worries! Your subscription was not created and you have not been charged.
              You can try again anytime or explore our free features.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/pricing')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Need help? Contact{' '}
            <a href="mailto:support@tavvy.com" className="text-blue-600 hover:underline">
              support@tavvy.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
