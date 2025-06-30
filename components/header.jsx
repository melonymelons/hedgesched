import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (<nav className="mx-auto py-2 px-4 flex justify-between">
        <Link href={"/"} className= "flex items-center">
        <Image 
            src = "/logo.png" 
            width = "180" 
            height = "90" 
            alt = "HEDGE Logo"
            className = "h-23 w-auto"
        />
    </Link>
    </nav>);
}

export default Header