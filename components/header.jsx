import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (<nav className="mx-auto py-2 px-4 flex justify-between">
        <Link href={"/"} className= "flex items-center">
        <Image 
            src = "/logo.png" 
            width = "150" 
            height = "60" 
            alt = "HEDGE Logo"
            className = "h-16 w-auto"
        />
    </Link>
    </nav>);
}

export default Header