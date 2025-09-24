import { useState } from 'react';
import CitizenApp from './components/CitizenApp';
import OfficialApp from './components/OfficialApp';
import AnalystApp from './components/AnalystApp';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Waves } from 'lucide-react';

type Role = 'citizen' | 'official' | 'analyst';

function App() {
  const [role, setRole] = useState<Role | null>(null);

  if (!role) {
    return <RoleSelectionScreen onSelectRole={setRole} />;
  }

  switch (role) {
    case 'citizen':
      return <CitizenApp />;
    case 'official':
      return <OfficialApp />;
    case 'analyst':
      return <AnalystApp />;
    default:
      return null;
  }
}

const RoleSelectionScreen = ({ onSelectRole }: { onSelectRole: (role: Role) => void }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Waves className="w-12 h-12 text-slate-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Tarang</CardTitle>
          <CardDescription>Ocean Hazard Reporting Platform</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => onSelectRole('citizen')} className="w-full">Community Member</Button>
          <Button onClick={() => onSelectRole('official')} className="w-full">Safety Official</Button>
          <Button onClick={() => onSelectRole('analyst')} className="w-full">Data Analyst</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
