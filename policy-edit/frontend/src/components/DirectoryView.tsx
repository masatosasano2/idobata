// src/components/DirectoryView.tsx
import type React from "react";
import { FaFileAlt, FaFolder } from "react-icons/fa"; // Folder and File icons
import { Link } from "react-router-dom";

// Define the expected structure of items in the directory data array
// This should align with the GitHub API response for directory contents
interface DirectoryItem {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule"; // GitHub API types
  sha: string; // Use sha as key
  // Add other properties if needed, e.g., size, download_url
}

interface DirectoryViewProps {
  data: DirectoryItem[]; // Expecting an array of directory items
}

const DirectoryView: React.FC<DirectoryViewProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        このディレクトリは空です。
      </div>
    );
  }

  // Data is assumed to be pre-sorted by the store (folders first, then files, alphabetically)

  const formatFileName = (name: string) => {
    return name.endsWith(".md") ? name.slice(0, -3) : name;
  };

  const filteredData = data.filter((item) => !item.name.startsWith(".") && 
    !["license", "license.md", "license.txt", "license.rst"].includes(item.name.toLowerCase()));

  return (
    <div className="border rounded overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {filteredData.map((item) => (
          <li
            key={item.sha}
            className="hover:bg-gray-50 transition-colors duration-150"
          >
            <Link
              to={`/view/${item.path}`} // Navigate to the item's path
              className="flex items-center p-3 text-sm"
              title={`${item.type === "dir" ? "ディレクトリ" : "ファイル"} ${item.name} へ移動`}
            >
              {item.type === "dir" ? (
                <FaFolder className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
              ) : (
                <FaFileAlt className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
              )}
              <span className="text-gray-800 truncate text-base">
                {formatFileName(item.name)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectoryView;
