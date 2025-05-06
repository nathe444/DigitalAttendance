import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft, FolderPlus } from "lucide-react";

import { useCreateProgramMutation } from "@/store/apis/orgAdmin/orgAdminApi";
import { useViewAllOrganizationsQuery } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateProgram() {
  const navigate = useNavigate();
  const [createProgram, { isLoading }] = useCreateProgramMutation();

  const { data: organizations, isLoading: isLoadingOrgs } =
    useViewAllOrganizationsQuery();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    code?: string;
    org?: string;
  }>({});

  console.log(code);

  const handleBack = () => {
    navigate(-1);
  };

  const validateForm = () => {
    const newErrors: { name?: string; code?: string; org?: string } = {};
    let isValid = true;

    if (!selectedOrg) {
      newErrors.org = "Please select an organization";
      isValid = false;
    }

    if (!name.trim()) {
      newErrors.name = "Program name is required";
      isValid = false;
    } else if (name.length < 3) {
      newErrors.name = "Program name must be at least 3 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    setSelectedOrg(selectedCode);
    setCode(selectedCode);
    // Find the organization by code and set its id
    const org = organizations?.results?.find(
      (org: any) => org.code === selectedCode
    );
    setSelectedOrgId(org?.id || "");
    setErrors((prev) => ({ ...prev, org: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createProgram({ name, code }).unwrap();
      toast.success("Program created successfully");
      navigate(`/programs/${selectedOrgId}`);
    } catch (error: any) {
      if (error.data?.detail) {
        toast.error(error.data.detail);
      } else if (error.data?.name) {
        toast.error(`Name: ${error.data.name[0]}`);
      } else if (error.data?.code) {
        toast.error(`Code: ${error.data.code[0]}`);
      } else {
        toast.error("Failed to create program. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 mb-6 group transition-all duration-200"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:translate-x-[-2px] transition-transform" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center mb-6">
            <div className="md:bg-blue-100 p-3 rounded-full mb-4 sm:mb-0 sm:mr-4 inline-flex">
              <FolderPlus className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-blue-800 mb-2">
                Create New Program
              </h1>
              <p className="text-gray-600">
                Create a new program for your organization to organize courses
                and activities.
              </p>
            </div>
          </div>

          <div className="bg-transparent border-blue-100  p-6 md:p-8 mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Select */}
              <div className="space-y-2">
                <Label
                  htmlFor="organization"
                  className="text-blue-800 font-medium block mb-1.5"
                >
                  Organization
                </Label>
                <select
                  id="organization"
                  value={selectedOrg}
                  onChange={handleOrgChange}
                  disabled={isLoadingOrgs}
                  className={`h-12 w-full border-blue-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-white ${
                    errors.org
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                >
                  <option value="">Select an organization</option>
                  {organizations?.results?.map((org: any) => (
                    <option key={org.code} value={org.code}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {errors.org && (
                  <p className="text-sm text-red-500 mt-1.5 flex items-center">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                    {errors.org}
                  </p>
                )}
              </div>

              {/* Program Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-blue-800 font-medium block mb-1.5"
                >
                  Program Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter program name"
                  className={`h-12 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1.5 flex items-center">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-blue-800 font-medium block mb-1.5"
                >
                  Program Code (Organization Code)
                </Label>
                <Input
                  id="code"
                  value={code}
                  readOnly
                  placeholder="Organization ID will appear here"
                  className="h-12 border-blue-100 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The program code is set to the selected organization's Code.
                </p>
              </div>

              <div className="flex justify-end pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="mr-4 border-blue-200 hover:bg-blue-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors px-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className=" h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Program"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
