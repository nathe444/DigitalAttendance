import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Building, Plus } from "lucide-react";
import { useCreateOrganizationMutation } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function CreateOrganization() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [createOrganization, { isLoading, isSuccess }] =
    useCreateOrganizationMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !code) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createOrganization({ name, code }).unwrap();
      toast.success("Organization created successfully");
      setName("");
      setCode("");
      navigate("/organization/all");
    } catch (error: any) {
      console.error("Failed to create organization:", error);
      toast.error(
        error.data?.error || error.data?.code || "Failed to create organization"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-800 flex items-center justify-center">
            Create Organization
            <Building className="h-12 w-12 text-blue-700 ml-3" />
          </h1>

          <p className="text-gray-600 mt-2">
            Set up a new organization in the system
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-transparent"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="org-name"
                className="text-gray-700 text-sm font-medium"
              >
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="org-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter organization name"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                required
                disabled={isLoading || isSuccess}
              />
              <p className="text-xs text-gray-500">
                The full name of your organization
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="org-code"
                className="text-gray-700 text-sm font-medium"
              >
                Organization Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="org-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter organization code"
                className="w-full border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                required
                disabled={isLoading || isSuccess}
              />
              <p className="text-xs text-gray-500">
                A unique code to identify your organization
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading || isSuccess || !name || !code}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Created
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organization
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
