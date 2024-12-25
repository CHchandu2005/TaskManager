import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify'; // Import Sonner
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {



  // const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("Token");

  // console.log(navigate);

  useEffect(() => {
    (token || user) && navigate("/");
  }, [token,user,navigate])



  const [passwordVisible, setPasswordVisible] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const onSubmit = async (data) => {
    // console.log("Form Submitted:", data);

    try {
      // Send login request to backend
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Parse response
      const result = await response.json();

      if (response.ok) {

        const token = result.token;

        localStorage.setItem("Token", token);

        // Display success toast
        toast.success("Login Successful!", {
          style: {
            color: "green",
          },
        });
        // Navigate to the desired page
        navigate("/dashboard"); // Update with your desired route
      } else {
        // Error handling
        toast.error(result.message || "Login failed!", {
          style: {
            color: "red",
          },
        });
      }
    } catch (error) {
      // Network or unexpected error handling
      console.error("Error during login:", error);
      toast.error("Something went wrong. Please try again!", {
        style: {
          color: "red",
        },
      });
    }
  };
  const handleValidationErrors = () => {
    if (errors.email) {
      toast.error(errors.email.message, {
        style: {
          color: 'red',
        },
      });
    }
    if (errors.password) {
      toast.error(errors.password.message, {
        style: {
          color: 'red',
        },
      });
    }
  };

  return (
    <div className="d-flex min-vh-100 justify-content-center align-items-center bg-light flex-column">
      <div className="text-center mb-4" style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)' }}>
        <img
          src="logo.png"
          alt="Logo"
          style={{
            width: '50px',
          }}
        />
      </div>

      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
          handleValidationErrors();
        }}
        className="p-4 rounded shadow login-form bg-white w-100"
        style={{ maxWidth: '400px', paddingTop: '100px' }}
      >
        {/* Title */}
        <h2
          className="text-center mb-4"
          style={{
            color: '#007bff',
            fontSize: '2rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 10px rgba(0, 123, 255, 0.5)',
          }}
        >
          Login
        </h2>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-primary">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format',
              },
            })}
          />
        </div>

        {/* Password Field */}
        <div className="mb-4 position-relative">
          <label htmlFor="password" className="form-label text-primary">Password</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            className="form-control"
            id="password"
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
          />
          <button
            type="button"
            className="btn position-absolute"
            onClick={togglePasswordVisibility}
            style={{
              background: 'none',
              border: 'none',
              right: '10px',
              top: '75%',
              transform: 'translateY(-50%)',
            }}
          >
            {passwordVisible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <div>
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}



