import React from 'react';
import { UserCircle } from 'lucide-react';

interface AuthorConfig {
  name: string;
  image: string | null;
  show: boolean;
}

interface Props {
  authorConfig: AuthorConfig;
  setAuthorConfig: React.Dispatch<React.SetStateAction<AuthorConfig>>;
}

export default function AuthorControls({ authorConfig, setAuthorConfig }: Props) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAuthorConfig(prev => ({
          ...prev,
          image: event.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-auto bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-2 text-gray-700">
        <UserCircle className="h-4 w-4" />
        <h3 className="font-medium">लेखक विवरण</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-author"
            checked={authorConfig.show}
            onChange={(e) => setAuthorConfig(prev => ({ ...prev, show: e.target.checked }))}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="show-author" className="ml-2 block text-sm text-gray-700">
            लेखक विवरण दिखाएं
          </label>
        </div>

        {authorConfig.show && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">लेखक का नाम</label>
              <input
                type="text"
                value={authorConfig.name}
                onChange={(e) => setAuthorConfig(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="लेखक का नाम"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">प्रोफाइल फोटो</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}