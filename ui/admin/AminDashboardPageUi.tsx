'use client'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebaseConfig'
import { signOut } from 'firebase/auth'
import { 
  FaUserShield, 
  FaFileAlt, 
  FaImages, 
  FaTools, 
  FaSignOutAlt, 
  FaArrowRight 
} from 'react-icons/fa'
import { HiShieldCheck } from 'react-icons/hi'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function AdminDashboardUi() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
        await signOut(auth)
        toast.success("Admin Signed Out")
        router.push('/')
        } catch (error) {
        toast.error("Logout failed")
        }
    }

  const adminCards = [
    {
      title: "Service Manager",
      desc: "Edit funeral packages, pricing, and service descriptions.",
      icon: <FaTools size={24} />,
      url: "/admin/services",
      color: "bg-blue-600"
    },
    {
      title: "Obituary Editor",
      desc: "Post and manage digital tributes and funeral announcements.",
      icon: <FaFileAlt size={24} />,
      url: "/admin/obituaries",
      color: "bg-emerald-600"
    },
    {
      title: "Gallery & Inventory",
      desc: "Update casket catalog and funeral service gallery photos.",
      icon: <FaImages size={24} />,
      url: "/admin/inventory",
      color: "bg-purple-600"
    },
    {
      title: "Staff & Inquiries",
      desc: "Manage admin access and view customer contact requests.",
      icon: <FaUserShield size={24} />,
      url: "/admin/staff",
      color: "bg-amber-600"
    }
  ];

    return (
        <div className="min-h-screen text-sans"
        >
            <div className="fixed inset-0 bg-center bg-cover"
                style={{ 
                    backgroundImage: `linear-gradient(to bottom, rgba(4, 13, 8, 0.92), rgba(4, 13, 8, 0.95)), url('https://images.pexels.com/photos/1102909/pexels-photo-1102909.jpeg?cs=srgb&dl=pexels-jplenio-1102909.jpg&fm=jpg')`,
                    zIndex: -1 
                }}
            />

            {/* Admin Navbar */}
            <nav className="border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                <HiShieldCheck className="text-emerald-600 text-2xl" />
                <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                    Laboc <span className="text-gray-400 font-medium">Control</span>
                </h1>
                </div>
                <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest"
                >
                <FaSignOutAlt /> Logout
                </button>
            </nav>

            <main className="max-w-6xl mx-auto py-12 px-6">
                <header className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Master Dashboard</h2>
                <p className="text-gray-500 mt-1 font-medium">Control panel for Laboc Funeral Services operations.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminCards.map((card, i) => (
                    <Link key={i} href={card.url}>
                    <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden h-full">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.color} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>
                        
                        <div className={`w-14 h-14 ${card.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200`}>
                        {card.icon}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">{card.desc}</p>
                        
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                        Launch Module <FaArrowRight />
                        </div>
                    </div>
                    </Link>
                ))}
                </div>

                <footer className="mt-20 pt-8 border-t border-gray-100 text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">
                    Authorized Personnel Only • {new Date().getFullYear()}
                </p>
                </footer>
            </main>
        </div>
    )
}