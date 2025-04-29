import { useState } from "react";
import { motion } from "framer-motion";
import SignaturePad from "react-signature-canvas";
import * as z from "zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/store/apis/auth/authApi";
import { useNavigate } from "react-router-dom";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const phoneSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type FormData = {
  email?: string;
  phone?: string;
};

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
  });

  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [signature, setSignature] = useState<string>("");
  const [sigPad, setSigPad] = useState<SignaturePad | null>(null);
  const [isEmailTab, setIsEmailTab] = useState(true);
  const validateForm = () => {
    try {
      const schema = isEmailTab ? emailSchema : phoneSchema;
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const clearSignature = () => {
    sigPad?.clear();
    setSignature("");
  };

  const saveSignature = () => {
    if (sigPad && !sigPad.isEmpty()) {
      const signatureData = sigPad.toDataURL();
      setSignature(signatureData);
      toast.success("Signature saved!");
    } else {
      toast.error("Please draw your signature first.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form data", formData);
    const isFormValid = validateForm();
    if (!signature) {
      toast.error("Please provide and save your signature");
      return;
    }

    if (!isFormValid) return;

    try {
      const formToSend = new FormData();
      if (isEmailTab && formData.email != null) {
        formToSend.append("email", formData.email);
      } else if (!isEmailTab && formData.phone != null) {
        formToSend.append("phone", formData.phone);
      }

      formToSend.append("signature_base64", signature);
      console.log("sending form", formToSend);

      if (!formData.phone) return;

      const response = await login({
        phone: formData.phone,
        signature_base64: signature,
      }).unwrap();

      console.log("resp", response);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "error" in error.data
      ) {
        toast.error(String(error.data.error));
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const visualVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side: Form */}
      <motion.div
        className="flex-1 flex items-center justify-center "
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative w-full max-w-md p-6 rounded-xl bg-white/90 backdrop-blur-sm">
          <div className="mb-5 ">
            <h1 className="text-2xl font-bold text-indigo-600">Login</h1>
            <p className="text-balance text-gray-600 mt-1 text-sm">
              Login to your account
            </p>
          </div>

          {/* Tabs for email and phone selection */}
          <div className="flex mb-4">
            <button
              type="button"
              onClick={() => setIsEmailTab(true)}
              className={`w-1/2 py-2 text-center font-medium rounded-t-lg ${
                isEmailTab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setIsEmailTab(false)}
              className={`w-1/2 py-2 text-center font-medium rounded-t-lg ${
                !isEmailTab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Phone
            </button>
          </div>

          {/* Conditional inputs for Email or Phone */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isEmailTab ? (
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-1 text-sm"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full h-10 px-3 rounded-lg border bg-white/50 transition-all outline-none ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                  required
                  autoComplete="off"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full h-12 px-4 rounded-xl border-2 bg-white/50 transition-all outline-none ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  }`}
                  required
                  autoComplete="off"
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>
            )}

            {/* Signature Pad */}
            <div>
              <label className="mb-1 block text-gray-700 font-medium">
                Signature
              </label>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <SignaturePad
                  ref={setSigPad}
                  canvasProps={{ className: "w-full h-32 bg-white" }}
                  penColor="#3b82f6"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="font-medium rounded-lg border-2 text-white bg-red-500 hover:bg-red-500 transition-colors outline-none border-none"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-700 border-2 border-indigo-200 hover:bg-indigo-200 transition-colors"
                >
                  Save Signature
                </button>
              </div>
              {!signature && isLoading && (
                <p className="text-xs text-red-600 mt-1">
                  Please save your signature.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="w-full rounded-full py-3 text-base font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center gap-1">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Logging in...</span>
                  </div>
                ) : isSuccess ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-300" />
                  </motion.span>
                ) : (
                  <>Login</>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Right Side: Visual */}
      <motion.div
        className="flex-1 hidden lg:flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800"
        variants={visualVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 z-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <h1 className="text-6xl text-center font-extrabold text-white tracking-wide leading-tight">
            Attendance Management
          </h1>
        </div>
      </motion.div>
    </div>
  );
}
