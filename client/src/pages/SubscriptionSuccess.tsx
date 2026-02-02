/**
 * Subscription Success Page
 * 
 * Shown after successful Stripe checkout
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // TODO: Verify session and update user subscription status
    console.log('Stripe session ID:', sessionId);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Welcome to Tavvy Pro!</CardTitle>
          <CardDescription>
            Your subscription is now active
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              What's Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Complete your profile to get better matches</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Browse verified contractors in your area</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span>Start your first project request</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate('/subscription')}
              variant="outline"
              className="w-full"
            >
              Manage Subscription
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            A confirmation email has been sent to your inbox
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
