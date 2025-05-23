import { Navigate } from "react-router";
import { usePocket } from "../contexts/PocketContext";
import { useState } from "react";
import toast from "react-hot-toast";

function Signin() {
  const { user, adminLogin } = usePocket()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    adminLogin(formData.email, formData.password)
      .then(() => {
        toast.success("Sign In successful");
      })
      .catch(() => toast.error("Sign In failed"))
      .finally(() => setIsLoading(false));
  };

  if (!!user) return <Navigate to={"/"} />

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form className="border border-base-300 rounded p-8 bg-base-200 w-96" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold mb-8 text-center">Welcome to Qrio Admin</h3>
        <div className="grid grid-cols-1 gap-5">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="text"
              className="input"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input"
              placeholder="******"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </fieldset>
          <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
            {isLoading && <span className="loading loading-spinner" />}
            Sign In
          </button>
        </div>
      </form>
    </div>
  )
}

export default Signin