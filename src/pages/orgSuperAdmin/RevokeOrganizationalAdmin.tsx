import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Building, Loader2, UserMinus } from "lucide-react";
import { useRevokeOrganizationalAdminMutation } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";
import { useViewAllOrganizationsQuery } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RevokeOrganizationalAdmin() {
  const [revokeAdmin, { isLoading }] = useRevokeOrganizationalAdminMutation();
  const { data: organizations, isLoading: isLoadingOrgs } =
    useViewAllOrganizationsQuery();

  const [formData, setFormData] = useState({
    organization: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    organization: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      organization: "",
      email: "",
    };

    let isValid = true;

    if (!formData.organization) {
      newErrors.organization = "Please select an organization";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await revokeAdmin({
        data: {
          email: formData.email,
        },
        id: formData.organization,
      }).unwrap();

      toast.success("Administrator access revoked successfully");

      // Reset form
      setFormData({
        organization: "",
        email: "",
      });
    } catch (error: any) {
      console.error("Failed to revoke admin:", error);
      toast.error(
        error.data?.error ||
          error.data?.detail ||
          "Failed to revoke administrator access"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-blue-800 flex items-center justify-center">
            Revoke Admin Access
            <UserMinus className="h-8 w-8 text-red-500 ml-3" />
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Remove administrator access from an organization
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent p-8 rounded-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="organization"
                className="text-blue-800 font-medium"
              >
                Organization
              </Label>
              <Select
                disabled={isLoadingOrgs}
                onValueChange={(value) =>
                  handleSelectChange("organization", value)
                }
                value={formData.organization}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-12 transition-all">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent className="border-blue-200">
                  {isLoadingOrgs ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    </div>
                  ) : organizations?.results?.length ? (
                    organizations.results.map((org: any) => (
                      <SelectItem
                        key={org.id}
                        value={org.id}
                        className="focus:bg-blue-50"
                      >
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-500" />
                          {org.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No organizations available
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.organization && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.organization}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800 font-medium">
                Administrator Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-12 transition-all"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-6">
                <h3 className="text-red-800 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Warning
                </h3>
                <p className="text-red-700 text-sm mt-1">
                  This action will immediately revoke all administrative
                  privileges for this user. They will no longer be able to
                  manage this organization.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-12 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Revoking Access...
                  </>
                ) : (
                  <>
                    <UserMinus className="mr-2 h-5 w-5" />
                    Revoke Administrator Access
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
