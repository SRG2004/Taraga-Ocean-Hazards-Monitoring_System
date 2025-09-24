import React, { useState } from 'react';
import { CitizenApp } from './components/CitizenApp';
import { OfficialApp } from './components/OfficialApp';
import { AnalystApp } from './components/AnalystApp';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Waves, Users, Shield, BarChart3 } from 'lucide-react';

type Role = 'citizen' | 'official' | 'analyst' | null;

const App: React.FC = () => {
  const [role, setRole] = useState<Role>(null);

  const handleRoleChange = () => setRole(null);

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Waves className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Tarang</CardTitle>
            <CardDescription>Ocean Hazard Reporting Platform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button onClick={() => setRole('citizen')} className="w-full bg-slate-600 hover:bg-slate-600/90">
              <Users className="mr-2 h-5 w-5" />
              Community Member
            </Button>
            <Button onClick={() => setRole('official')} className="w-full bg-slate-700 hover:bg-slate-700/90">
              <Shield className="mr-2 h-5 w-5" />
              Safety Official
            </Button>
            <Button onClick={() => setRole('analyst')} className="w-full bg-slate-800 hover:bg-slate-800/90">
              <BarChart3 className="mr-2 h-5 w-5" />
              Data Analyst
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  switch (role) {
    case 'citizen':
      return <CitizenApp onRoleChange={handleRoleChange} />;
    case 'official':
      return <OfficialApp onRoleChange={handleRoleChange} />;
    case 'analyst':
      return <AnalystApp onRoleChange={handleRoleChange} />;
    default:
      return null;
  }
};

export default App;
