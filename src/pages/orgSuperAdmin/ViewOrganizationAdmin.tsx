import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  UserPlus,
  Archive,
  ClipboardCheck,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function ViewOrganizationAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = location.state?.data || "";

  console.log(admin);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "UA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30">
      <div className="w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 mb-4"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Administrators
          </Button>
        </div>

        {admin ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section with Background and Avatar */}
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-700 w-full"></div>
              <div className="absolute top-32 left-8 sm:left-12 lg:left-16 flex items-end">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md bg-white">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-3xl">
                    {getInitials(admin.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-6 pb-4">
                  <Badge
                    className={`${
                      admin.is_active
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {admin.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 mt-16">
              <div className="max-w-7xl mx-auto">
                {/* Admin Name and Role */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-blue-900">
                    {admin.user.name || "Unnamed Administrator"}
                  </h1>
                  <div className="flex items-center mt-1">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {admin.role || "Administrator"}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Information Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Contact Information */}
                  <section className="space-y-6">
                    <h2 className="text-lg font-semibold text-blue-800 flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Contact Information
                    </h2>

                    <div className="space-y-5">
                      <div className="group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium">{admin.user.email || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium">{admin.user.phone || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                        <div className="flex items-start">
                          <Building className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Organization</p>
                            <p className="font-medium">
                              {admin.organization?.name || "N/A"}
                            </p>
                            {admin.organization?.code && (
                              <p className="text-xs text-gray-400">
                                Code: {admin.organization.code}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Timeline */}
                  <section className="space-y-6">
                    <h2 className="text-lg font-semibold text-blue-800 flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Timeline
                    </h2>

                    <div className="space-y-5">
                      <div className="group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Joined Date</p>
                            <p className="font-medium">{formatDate(admin.joined_at)}</p>
                          </div>
                        </div>
                      </div>

                      {admin.added_by && (
                        <div className="group hover:bg-blue-50 p-3 rounded-lg transition-colors">
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                            <div>
                              <p className="text-sm text-gray-500">Added By</p>
                              <p className="font-medium">
                                {admin.added_by.name || admin.added_by.email || "N/A"}
                              </p>
                              {admin.added_by.email && admin.added_by.name && (
                                <p className="text-xs text-gray-400">
                                  {admin.added_by.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Permissions */}
                  <section className="space-y-6 lg:col-span-1">
                    <h2 className="text-lg font-semibold text-blue-800 flex items-center">
                      <Shield className="mr-2 h-5 w-5" />
                      Permissions
                    </h2>

                    <div className="space-y-3">
                      <div className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <UserPlus className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">Add Administrators</p>
                          <p className="text-sm text-gray-500">
                            Can add other administrators
                          </p>
                        </div>
                        {admin.can_add_another_admin ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <Archive className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">Archive Organization</p>
                          <p className="text-sm text-gray-500">
                            Can archive the organization
                          </p>
                        </div>
                        {admin.can_archive_organization ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <ClipboardCheck className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">Modify Attendance</p>
                          <p className="text-sm text-gray-500">
                            Can change attendance validity
                          </p>
                        </div>
                        {admin.can_change_attendance_validity ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <FolderPlus className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">Create Programs</p>
                          <p className="text-sm text-gray-500">
                            Can create new programs
                          </p>
                        </div>
                        {admin.can_create_programs ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-blue-200 shadow-sm">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-800 mb-2 text-center">
                Administrator Not Found
              </h3>
              <p className="text-blue-600 mb-6 text-center">
                The administrator you're looking for could not be found.
              </p>
              <div className="flex justify-center">
                <Button onClick={handleBack}>Return to Administrators</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
