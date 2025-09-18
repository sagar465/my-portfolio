import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function EmailSetup() {
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeSnippet = `// In /components/Contact.tsx, replace:
access_key: 'YOUR_WEB3FORMS_KEY'

// With:
access_key: '${apiKey}'`;

    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    toast.success('Code snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const openWeb3Forms = () => {
    window.open('https://web3forms.com', '_blank');
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📧 Email Setup Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Step 1: Get your free API key</Label>
          <Button 
            onClick={openWeb3Forms}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open Web3Forms.com
          </Button>
          <p className="text-xs text-muted-foreground">
            Enter your email: sagar.varma8@gmail.com
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">Step 2: Paste your API key here</Label>
          <Input
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your Web3Forms API key"
          />
        </div>

        {apiKey && (
          <div className="space-y-2">
            <Label>Step 3: Copy this code and update Contact.tsx</Label>
            <div className="bg-muted p-3 rounded text-xs font-mono">
              <pre>{`access_key: '${apiKey}'`}</pre>
            </div>
            <Button 
              onClick={handleCopy}
              variant="outline" 
              size="sm"
              className="w-full flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code Snippet'}
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          ✅ Once updated, your contact form will send emails directly to your inbox!
        </div>
      </CardContent>
    </Card>
  );
}