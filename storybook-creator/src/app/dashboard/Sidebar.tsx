import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    {
        name: 'Story Groups', 
        icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="#8470FF" stroke="#8470FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.244 6.194C1.09 6.771 1 7.375 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1C7.374 1 6.771 1.09 6.194 1.244" stroke="#8470FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 8L3 3" stroke="#8470FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>),
        path: '/dashboard' 
    },
    {
        name: 'Books', 
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.451 11.699C15.938 15.697 12.517 16.27 9 15.702L16.451 11.699Z" fill="black"/>
                <path d="M16.451 11.699C15.938 15.697 12.517 16.27 9 15.702" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 19C5 19 6.469 6.096 19 5C18.373 6.093 18.358 7.918 17.94 9.748C17.353 12 15.325 12.28 12.84 12.28" fill="black"/>
                <path d="M5 19C5 19 6.469 6.096 19 5C18.373 6.093 18.358 7.918 17.94 9.748C17.353 12 15.325 12.28 12.84 12.28" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>),
        path: '/' 
    },
    {
        name: 'Students', 
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 6C15.75 6.99456 15.3549 7.94839 14.6516 8.65165C13.9484 9.35491 12.9945 9.75 12 9.75C11.0054 9.75 10.0516 9.35491 9.34833 8.65165C8.64506 7.94839 8.24998 6.99456 8.24998 6C8.24998 5.00544 8.64506 4.05161 9.34833 3.34835C10.0516 2.64509 11.0054 2.25 12 2.25C12.9945 2.25 13.9484 2.64509 14.6516 3.34835C15.3549 4.05161 15.75 5.00544 15.75 6ZM4.50098 20.118C4.53311 18.1504 5.33731 16.2742 6.74015 14.894C8.14299 13.5139 10.0321 12.7405 12 12.7405C13.9679 12.7405 15.857 13.5139 17.2598 14.894C18.6626 16.2742 19.4668 18.1504 19.499 20.118C17.1464 21.1968 14.5881 21.7535 12 21.75C9.32398 21.75 6.78398 21.166 4.50098 20.118Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>),
        path: '/' 
    },
  ];

  return (
    <div className="bg-black text-white w-48 min-h-screen flex flex-col justify-between rounded-tr-2xl rounded-br-2xl">
      <div>
        <nav className="pt-4">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800 ${pathname === item.path ? 'text-violet-400' : ''}`}
              onClick={() => router.push(item.path)}
            >
              <div className="mr-3">{item.icon}</div>
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
      </div>

    <Link href="/login">
    <div className="flex items-center p-4 cursor-pointer hover:bg-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
        </svg>
        <span>Logout</span>
    </div>
    </Link>
      
    </div>
  );
};

export default Sidebar;