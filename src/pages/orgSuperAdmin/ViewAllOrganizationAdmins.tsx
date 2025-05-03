import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building, Loader2, Users, Mail, ChevronRight } from "lucide-react";
import {
  useViewAllOrganizationsQuery,
  useViewAllOrganizationalAdminsQuery,
} from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ViewAllOrganizationAdmins() {
  const navigate = useNavigate();
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const { data: organizations, isLoading: isLoadingOrgs } =
    useViewAllOrganizationsQuery();
  const { data: admins, isLoading: isLoadingAdmins } =
    useViewAllOrganizationalAdminsQuery(selectedOrganization, {
      skip: !selectedOrganization,
    });

  const handleOrganizationChange = (value: string) => {
    setSelectedOrganization(value);
  };

  const handleAdminClick = (adminId: string) => {
    const admin = admins?.results?.find((admin: any) => admin.id === adminId);

    console.log(admin);
    navigate(`/organizational_admin/${selectedOrganization}/${adminId}`, {
      state: { data: admin },
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "UA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-blue-800 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            Organization Administrators
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            View all administrators for a selected organization
          </p>
        </motion.div>

        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="organization"
              className="text-blue-800 font-medium block mb-2"
            >
              Select Organization
            </Label>
            <Select
              disabled={isLoadingOrgs}
              onValueChange={handleOrganizationChange}
              value={selectedOrganization}
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
          </div>
        </div>

        {selectedOrganization && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLoadingAdmins ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-blue-800">
                  Loading administrators...
                </span>
              </div>
            ) : admins?.results?.length ? (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-hidden bg-white border border-blue-200 rounded-xl shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50">
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Permissions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.results.map((admin: any) => (
                        <TableRow
                          key={admin.id}
                          className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                          onClick={() => handleAdminClick(admin.id)}
                        >
                          <TableCell>
                            <Avatar className="h-10 w-10 border border-blue-100">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {getInitials(admin.user.name)}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">
                            {admin.user.name || "Unnamed Admin"}
                          </TableCell>
                          <TableCell>{admin.user.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {admin.role || "Administrator"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {admin.can_add_another_admin && (
                                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                  Add Admins
                                </Badge>
                              )}
                              {admin.can_archive_organization && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                  Archive
                                </Badge>
                              )}
                              {admin.can_change_attendance_validity && (
                                <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                                  Attendance
                                </Badge>
                              )}
                              {admin.can_create_programs && (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                  Programs
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                  {admins.results.map((admin: any) => (
                    <Card
                      key={admin.id}
                      className="overflow-hidden border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleAdminClick(admin.id)}
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-12 w-12 border-2 border-blue-100">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getInitials(admin.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-900">
                              {admin.user.name || "Unnamed Admin"}
                            </h3>
                            <div className="flex items-center text-gray-500 mt-1 text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>{admin.user.email}</span>
                            </div>
                            <div className="mt-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {admin.role || "Administrator"}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-blue-500" />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {admin.can_add_another_admin && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              Add Admins
                            </Badge>
                          )}
                          {admin.can_archive_organization && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                              Archive
                            </Badge>
                          )}
                          {admin.can_change_attendance_validity && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                              Attendance
                            </Badge>
                          )}
                          {admin.can_create_programs && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                              Programs
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  No Administrators Found
                </h3>
                <p className="text-blue-600">
                  This organization doesn't have any administrators assigned
                  yet.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!selectedOrganization && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Building className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Select an Organization
            </h3>
            <p className="text-blue-600">
              Please select an organization to view its administrators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
