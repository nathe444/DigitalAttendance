import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  UserPlus,
  Archive,
  ClipboardCheck,
  FolderPlus,
  Loader2,
} from "lucide-react";
import { useUpdateOrganizationalAdminMutation } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function UpdateOrganizationalAdmin() {
  const [updateAdmin, { isLoading }] = useUpdateOrganizationalAdminMutation();
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const location = useLocation();
  const admin = location.state?.data || "";

  console.log(admin);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    can_add_another_admin: false,
    can_archive_organization: false,
    can_change_attendance_validity: false,
    can_create_programs: false,
  });

  useEffect(() => {
    setFormData({
      email: admin.user.email,
      role: admin.role,
      can_add_another_admin: admin.can_add_another_admin,
      can_archive_organization: admin.can_archive_organization,
      can_change_attendance_validity: admin.can_change_attendance_validity,
      can_create_programs: admin.can_create_programs,
    });
  }, [admin]);

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

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors = {
      organization: "",
      email: "",
    };

    let isValid = true;

    if (!organizationId) {
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
      if (organizationId) {
        await updateAdmin({ data: formData, id: organizationId }).unwrap();
      }

      toast.success("Administrator updated successfully");
      navigate("/organizational_admin/all");

      setFormData({
        email: "",
        role: "admin",
        can_add_another_admin: false,
        can_archive_organization: false,
        can_change_attendance_validity: false,
        can_create_programs: false,
      });
    } catch (error: any) {
      console.error("Failed to update admin:", error);
      toast.error(
        error.data?.error ||
          error.data?.detail ||
          "Failed to update administrator"
      );
    }
  };

  console.log(organizationId);
  console.log(formData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-blue-800 flex items-center justify-center">
            Update Organization Admin
            <UserPlus className="h-8 w-8 text-blue-600 ml-3" />
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Designate an administrator to manage an organization
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-transparent p-8 rounded-xl border-none"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-800 font-medium">
                  Email Address
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

              <div className="space-y-2">
                <Label htmlFor="role" className="text-blue-800 font-medium">
                  Role
                </Label>
                <Input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Enter role (e.g. Administrator)"
                  className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-12 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-lg font-medium text-blue-800 mb-4">
                Permissions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <UserPlus className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <Label
                      htmlFor="can_add_another_admin"
                      className="font-medium text-blue-900"
                    >
                      Add Administrators
                    </Label>
                    <p className="text-sm text-gray-600">
                      Can add other administrators
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="can_add_another_admin"
                      checked={formData.can_add_another_admin}
                      onChange={(e) =>
                        handleSwitchChange(
                          "can_add_another_admin",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <Archive className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <Label
                      htmlFor="can_archive_organization"
                      className="font-medium text-blue-900"
                    >
                      Archive Organization
                    </Label>
                    <p className="text-sm text-gray-600">
                      Can archive the organization
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="can_archive_organization"
                      checked={formData.can_archive_organization}
                      onChange={(e) =>
                        handleSwitchChange(
                          "can_archive_organization",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <ClipboardCheck className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <Label
                      htmlFor="can_change_attendance_validity"
                      className="font-medium text-blue-900"
                    >
                      Modify Attendance
                    </Label>
                    <p className="text-sm text-gray-600">
                      Can change attendance validity
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="can_change_attendance_validity"
                      checked={formData.can_change_attendance_validity}
                      onChange={(e) =>
                        handleSwitchChange(
                          "can_change_attendance_validity",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <FolderPlus className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="flex-1">
                    <Label
                      htmlFor="can_create_programs"
                      className="font-medium text-blue-900"
                    >
                      Create Programs
                    </Label>
                    <p className="text-sm text-gray-600">
                      Can create new programs
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="can_create_programs"
                      checked={formData.can_create_programs}
                      onChange={(e) =>
                        handleSwitchChange(
                          "can_create_programs",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Administrator...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Update Administrator
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
