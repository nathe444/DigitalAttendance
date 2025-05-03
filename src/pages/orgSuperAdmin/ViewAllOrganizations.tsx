import { motion } from "framer-motion";
import { useViewAllOrganizationsQuery } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";
import { Building, Calendar, User, Loader2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useArchiveOrganizationMutation } from "@/store/apis/staff/staffApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function ViewAllOrganizations() {
  const { data, isLoading, error, refetch } = useViewAllOrganizationsQuery();
  const [archiveOrganization, { isLoading: isArchiving }] =
    useArchiveOrganizationMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openArchiveDialog = (org: { id: string; name: string }) => {
    setSelectedOrg(org);
    setDialogOpen(true);
  };

  console.log(data);

  const handleArchive = async () => {
    if (!selectedOrg) return;

    try {
      await archiveOrganization(selectedOrg.id).unwrap();
      toast.success(`${selectedOrg.name} archived successfully`);
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error("Failed to archive organization:", error);
      toast.error(
        error.data?.error ||
          error.data?.detail ||
          "Failed to archive organization"
      );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive Organization</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive {selectedOrg?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleArchive}
              disabled={isArchiving}
              className="gap-1"
            >
              {isArchiving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Archiving...
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  Archive
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-blue-800 flex items-center justify-center">
              Organizations Directory
              <Building className="h-10 w-10 text-blue-600 ml-3" />
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              View and manage all organizations in your attendance system
            </p>
          </motion.div>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center h-64 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-100"
            >
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-3" />
              <span className="text-blue-700 font-medium">
                Loading organizations...
              </span>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center shadow-sm"
            >
              <p className="font-medium">Unable to load organizations</p>
              <p className="text-sm mt-1">
                Please try again later or contact support
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block overflow-hidden rounded-xl border border-blue-300 bg-white shadow-md"
              >
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <tr className="text-white">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider border-b border-blue-500">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b border-blue-200">
                        Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b border-blue-200">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold  uppercase tracking-wider border-b border-blue-200">
                        Created By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold  uppercase tracking-wider border-b border-blue-200">
                        Created At
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold  uppercase tracking-wider border-b border-blue-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-100">
                    {data?.results && data.results.length > 0 ? (
                      data.results.map((org) => (
                        <tr
                          key={org.id}
                          className="hover:bg-blue-50/70 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                            {org.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                            {org.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                org.is_active
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {org.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {org.created_by?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(org.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {org.is_active && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                  openArchiveDialog({
                                    id: org.id,
                                    name: org.name,
                                  })
                                }
                              >
                                Archive
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          <p className="font-medium text-blue-800">
                            No organizations found
                          </p>
                          <p className="text-sm mt-1">
                            Create your first organization to get started
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>

              {/* Mobile view - Cards */}
              <div className="md:hidden space-y-4">
                {data?.results && data.results.length > 0 ? (
                  data.results.map((org, index) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-xl border border-blue-300 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-4 border-b border-blue-300 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center">
                        <div className="flex flex-col gap-3">
                          <h3 className="font-medium text-white">{`Name  ${org.name}`}</h3>
                          <p className="text-sm text-blue-100 font-mono">
                            {`Code  ${org.code}`}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            org.is_active
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {org.is_active ? "Active" : "Inactive"}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 py-1 border-b border-gray-100">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-gray-700">Created by</span>
                          </div>
                          <span className="font-medium">
                            {org.created_by?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 py-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-gray-700">Created on</span>
                          </div>
                          <span className="font-medium">
                            {formatDate(org.created_at)}
                          </span>
                        </div>

                        {org.is_active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-3 text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-100"
                            onClick={() =>
                              openArchiveDialog({
                                id: org.id,
                                name: org.name,
                              })
                            }
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Organization
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl border border-blue-200 p-8 text-center shadow-md"
                  >
                    <p className="font-medium text-blue-800">
                      No organizations found
                    </p>
                    <p className="text-sm mt-1 text-gray-600">
                      Create your first organization to get started
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          )}

          {/* Pagination */}
          {data && data.count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-8 flex justify-center"
            >
              <div className="inline-flex rounded-md shadow-sm">
                <Button
                  variant="outline"
                  className="rounded-l-md border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="border-l-0 border-r-0 border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  className="rounded-r-md border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                  disabled
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
