import { useState } from "react";
import { motion } from "framer-motion";
import SignaturePad from "react-signature-canvas";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRegisterMutation } from "@/store/apis/auth/authApi";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  name: z.string().min(1, "Name is required"),
});

type FormData = z.infer<typeof formSchema>;
interface PointType {
  x: number;
  y: number;
}
export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    name: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [signature, setSignature] = useState<string>("");
  const [signatureStroke, setSignatureStroke] = useState<PointType[][] | null>(
    null
  );
  const [sigPad, setSigPad] = useState<SignaturePad | null>(null);

  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const validateForm = () => {
    try {
      formSchema.parse(formData);
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
      const signatureStrokeData = sigPad.toData();
      setSignatureStroke(signatureStrokeData);
      toast.success("Signature saved!");
    } else {
      toast.error("Please draw your signature first.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (!signature) {
      toast.error("Please provide and save your signature");
      return;
    }

    if (!isFormValid) return;

    try {
      const response = await register({
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        signature_base64: signature,
        signature_stroke: signatureStroke
          ? JSON.stringify(signatureStroke)
          : "",
      }).unwrap();
      console.log("resp", response);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
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
            <h1 className="text-2xl font-bold text-indigo-600">Register</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email and Phone Inputs */}

            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-1 text-sm"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full h-10 px-3 rounded-md border-2 bg-white/50 transition-all outline-none ${
                  errors.name ? "border-red-500" : "border-gray-200"
                }`}
                required
                autoComplete="off"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
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
                className={`w-full h-10 px-3 rounded-md border bg-white/50 transition-all outline-none ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
                required
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-1 text-sm"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full h-10 px-3 rounded-md border-2 bg-white/50 transition-all outline-none ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                }`}
                required
                autoComplete="off"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Signature Pad */}
            <div>
              <label className="mb-1 block text-gray-700 font-medium text-sm">
                Signature
              </label>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <SignaturePad
                  ref={setSigPad}
                  canvasProps={{
                    className: "w-full h-42 bg-white",
                  }}
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
                disabled={isLoading}
                className="w-full rounded-full py-3 text-base font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center gap-1">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  <>Create Account</>
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
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div
          className="relative z-10 max-w-xl w-full p-8"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
        >
          <img
            src="https://img.freepik.com/free-vector/time-management-concept-illustration_114360-1013.jpg"
            alt="Digital Attendance System"
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
          <div className="mt-8 text-white">
            <h2 className="text-3xl font-bold">Digital Attendance System</h2>
            <p className="mt-4 text-white/80 text-lg">
              Track attendance efficiently with our modern digital solution.
              Save time and increase productivity.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
