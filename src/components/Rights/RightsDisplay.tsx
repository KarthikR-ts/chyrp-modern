import { Rights } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { Copyright, CreativeCommons, Globe } from 'lucide-react';

interface RightsDisplayProps {
  rights: Rights;
  className?: string;
}

export function RightsDisplay({ rights, className = '' }: RightsDisplayProps) {
  const getLicenseInfo = (license: Rights['license']) => {
    switch (license) {
      case 'cc-by':
        return { name: 'CC BY', icon: CreativeCommons, color: 'bg-green-100 text-green-800' };
      case 'cc-by-sa':
        return { name: 'CC BY-SA', icon: CreativeCommons, color: 'bg-green-100 text-green-800' };
      case 'cc-by-nc':
        return { name: 'CC BY-NC', icon: CreativeCommons, color: 'bg-blue-100 text-blue-800' };
      case 'cc-by-nd':
        return { name: 'CC BY-ND', icon: CreativeCommons, color: 'bg-blue-100 text-blue-800' };
      case 'public-domain':
        return { name: 'Public Domain', icon: Globe, color: 'bg-gray-100 text-gray-800' };
      case 'all-rights-reserved':
      default:
        return { name: 'All Rights Reserved', icon: Copyright, color: 'bg-red-100 text-red-800' };
    }
  };

  const licenseInfo = getLicenseInfo(rights.license);
  const LicenseIcon = licenseInfo.icon;

  return (
    <div className={`text-xs text-muted-foreground border-t pt-3 mt-3 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className={`${licenseInfo.color} border-0`}>
            <LicenseIcon className="w-3 h-3 mr-1" />
            {licenseInfo.name}
          </Badge>
          
          {rights.attribution && (
            <span className="text-xs">
              Attribution: {rights.attribution}
            </span>
          )}
        </div>
        
        {rights.copyright && (
          <div className="flex items-center space-x-1">
            <Copyright className="w-3 h-3" />
            <span>{rights.copyright}</span>
          </div>
        )}
      </div>
      
      {/* License descriptions */}
      {rights.license.startsWith('cc-') && (
        <div className="mt-2 text-xs opacity-75">
          <a
            href={`https://creativecommons.org/licenses/${rights.license.replace('cc-', '')}/4.0/`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-primary"
          >
            View License Details
          </a>
        </div>
      )}
    </div>
  );
}