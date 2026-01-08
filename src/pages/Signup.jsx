// import { useState } from 'react';
// import { supabase } from '../services/supabaseClient';
// import { useNavigate } from 'react-router-dom';

// const signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) alert(error.message);
//     else alert('Check your email for confirmation!');
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border">
//       <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
//       <form onSubmit={handleSignup} className="space-y-4">
//         <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg" onChange={(e) => setPassword(e.target.value)} />
//         <button className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold">Register</button>
//       </form>
//     </div>
//   );
// };

// export default signup;


const Signup = () => {
  return <h1>Signup Page</h1>;
};

export default Signup;
