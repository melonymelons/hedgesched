import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";

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
        <div className = "flex items-center gap-4"> 
            <Link href = '/events?create=true'><Button className="flex items-center gap-2"><PenBox size={18}/>Create Event</Button></Link>
            <Button variant="outline">Login</Button>
        </div>
    </nav>);
}

export default Header