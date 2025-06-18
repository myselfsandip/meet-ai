"use client";

import { authClient } from "@/lib/auth-client"; //import the auth client
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader } from "lucide-react";


export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password
    }, {
      onSuccess: (ctx) => {
        alert('Success');
      },
      onError: (ctx) => {
        const errorMessage = ctx.error?.message || JSON.stringify(ctx.error);
        alert(errorMessage);
      }
    }
    )
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password
    }, {
      onSuccess: (ctx) => {
        alert('Login Successfull');
      },
      onError: (ctx) => {
        const errorMessage = ctx.error?.message || JSON.stringify(ctx.error);
        alert(errorMessage);
      }
    }
    )
  }

  if (isPending) {
    return <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin w-16 h-16 text-red-500" />
    </div>
  }

  if (session) {
    return <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as  {session.user.name}</p>

      <Button onClick={() => authClient.signOut()}>
        Sign out
      </Button>
    </div>
  }

  return <div className="flex flex-col gap-y-10">
    <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit}>Sign up</Button>
    </div>
    <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onLogin}>Login</Button>
    </div>
  </div>
}
