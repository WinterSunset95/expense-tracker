import { signOut } from "firebase/auth";
import { useAppContext } from "./AppContext"
import { Button } from "./ui/button";

export default function Profile() {

	const { auth } = useAppContext();

	if (!auth.currentUser) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<h1>Loading . . .</h1>
			</div>
		)
	}

	const logout = () => {
		signOut(auth)
		.then(() => {
			alert("Logout successful");
		})
		.catch((e) => {
			alert(e.message);
			console.log(e);
		})
	}

	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<Button onClick={logout}>Logout</Button>
		</div>
	)
}
