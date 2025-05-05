import { FormEvent } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAppContext } from "./AppContext";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Onboarding() {

	const { auth } = useAppContext();

	const handleLogin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");

		if (!email || !password) {
			alert("Please fill all fields");
			return;
		}

		signInWithEmailAndPassword(auth, email as string, password as string)
		.then((creds) => {
			alert("Login successful");
			console.log(creds);
		})
		.catch((error) => {
			alert(error.message);
		})
	}

	const handleSignin = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email");
		const password = formData.get("password");
		const confirm = formData.get("confirm");

		if (!email || !password || !confirm) {
			alert("Please fill all fields");
			return;
		}

		if (password !== confirm) {
			alert("Passwords do not match");
			return;
		}

		createUserWithEmailAndPassword(auth, email as string, password as string)
		.then((creds) => {
			alert("Sign Up successful");
			console.log(creds);
		})
		.catch((error) => {
			alert(error.message);
		})
	}

	const popUp = () => {
		signInWithPopup(auth, new GoogleAuthProvider())
		.then((creds) => {
			alert("Login successful");
			console.log(creds);
		})
		.catch((error) => {
			alert(error.message);
		})
	}

	return (
		<Tabs defaultValue="login" className="w-full max-w-96">
			<TabsList className="w-full flex flex-row">
				<TabsTrigger className="w-full" value="login">Login</TabsTrigger>
				<TabsTrigger className="w-full" value="signup">Sign Up</TabsTrigger>
			</TabsList>
			<TabsContent value="login">
				<Card className="flex flex-col p-4">
					<CardContent className="w-full p-0 flex flex-col gap-2">
						<h1 className="text-lg font-semibold text-center">Login to existing account</h1>
						<form onSubmit={handleLogin} className="w-full flex flex-col gap-2">
							<Input name="email" className="grow w-full" type="email" placeholder="Enter your email" />
							<Input name="password" className="grow w-full" type="password" placeholder="Enter your password" />
							<Button className="w-full" type="submit">Login</Button>
						</form>
						<div className="w-full text-center">OR</div>
						<Button onClick={popUp}>Continue with Google</Button>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="signup">
				<Card className="flex flex-col p-4">
					<CardContent className="w-full p-0 flex flex-col gap-2">
						<h1 className="text-lg font-semibold text-center">Create an account</h1>
						<form onSubmit={handleSignin} className="w-full flex flex-col gap-2">
							<Input name="email" className="grow w-full" type="email" placeholder="Enter your email" />
							<Input name="password" className="grow w-full" type="password" placeholder="Enter your password" />
							<Input name="confirm" className="grow w-full" type="password" placeholder="Confirm your password" />
							<Button className="w-full" type="submit">Sign Up</Button>
						</form>
						<div className="w-full text-center">OR</div>
						<Button onClick={popUp}>Continue with Google</Button>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	)
}
