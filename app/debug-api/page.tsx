'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugApiPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testEndpoint = async (url: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Testing ${name}: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`${name} Response:`, data);
      
      setApiResponse({
        endpoint: name,
        url,
        status: response.status,
        data: data,
        dataType: Array.isArray(data) ? 'Array' : typeof data,
        count: Array.isArray(data) ? data.length : 'N/A'
      });
    } catch (err) {
      console.error(`${name} Error:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const endpoints = [
    { name: 'Active Garages', url: 'http://localhost:8080/apis/garage/active' },
    { name: 'Available Services', url: 'http://localhost:8080/apis/garage/services/available' },
    { name: 'Available Vehicle Types', url: 'http://localhost:8080/apis/garage/vehicle-types/available' },
    { name: 'Garage Stats', url: 'http://localhost:8080/apis/garage/stats' },
    { name: 'Search Garages (Empty)', url: 'http://localhost:8080/apis/garage/search/advanced' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Debug Tool</h1>
        
        {/* Test Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {endpoints.map((endpoint) => (
                <Button
                  key={endpoint.name}
                  onClick={() => testEndpoint(endpoint.url, endpoint.name)}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  {endpoint.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Testing API...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-700">
                <h3 className="font-semibold mb-2">Error:</h3>
                <pre className="text-sm">{error}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Response */}
        {apiResponse && (
          <Card>
            <CardHeader>
              <CardTitle>API Response: {apiResponse.endpoint}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Status:</span>
                    <div className="text-green-600">{apiResponse.status}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Type:</span>
                    <div>{apiResponse.dataType}</div>
                  </div>
                  <div>
                    <span className="font-semibold">Count:</span>
                    <div>{apiResponse.count}</div>
                  </div>
                  <div>
                    <span className="font-semibold">URL:</span>
                    <div className="text-xs text-blue-600 break-all">{apiResponse.url}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Raw Data:</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                    {JSON.stringify(apiResponse.data, null, 2)}
                  </pre>
                </div>

                {/* Data Analysis */}
                {Array.isArray(apiResponse.data) && apiResponse.data.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Sample Item Structure:</h4>
                    <pre className="bg-blue-50 p-4 rounded-lg text-xs overflow-auto max-h-48">
                      {JSON.stringify(apiResponse.data[0], null, 2)}
                    </pre>
                    
                    {/* Check for missing fields */}
                    <div className="mt-4">
                      <h5 className="font-semibold mb-2">Field Analysis:</h5>
                      <div className="text-sm">
                        {Object.keys(apiResponse.data[0]).map((key) => (
                          <div key={key} className="flex justify-between py-1 border-b">
                            <span>{key}:</span>
                            <span className={`font-mono ${
                              apiResponse.data[0][key] === null || apiResponse.data[0][key] === undefined 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              {apiResponse.data[0][key] === null ? 'null' : 
                               apiResponse.data[0][key] === undefined ? 'undefined' :
                               typeof apiResponse.data[0][key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
