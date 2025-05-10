import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Calendar,
  Building,
  Archive,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useArchiveProgramMutation,
  useInviteOrganizationMutation,
  useGetInvitesQuery,
} from "@/store/apis/orgAdmin/orgAdminApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ProgramInvites from "./ProgramInvites";

const ViewProgram = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const program = location?.state[0];
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [organizationCode, setOrganizationCode] = useState("");
  const [codeError, setCodeError] = useState("");

  // Use the mutations and queries
  const [archiveProgram, { isLoading: isArchiving }] =
    useArchiveProgramMutation();
  const [inviteOrganization, { isLoading: isInviting }] =
    useInviteOrganizationMutation();
  
  // Add the query to get invites with skip option
  const { refetch: refetchInvites } = useGetInvitesQuery(program?.id, {
    skip: !program?.id,
  });

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(program);

  const handleArchiveProgram = async () => {
    try {
      await archiveProgram({
        id: program.id,
      }).unwrap();

      toast.success("The program has been successfully archived.");

      setIsArchiveDialogOpen(false);
      // Navigate back to refresh the program list
      navigate(-1);
    } catch (error: any) {
      console.error("Failed to archive program:", error);
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

  const handleInviteOrganization = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!organizationCode.trim()) {
      setCodeError("Organization code is required");
      return;
    }

    try {
      await inviteOrganization({
        data: { code: organizationCode },
        id: program.id,
      }).unwrap();

      toast.success("Organization invited successfully");
      setIsInviteDialogOpen(false);
      setOrganizationCode("");
      setCodeError("");
      
      // Refetch invites instead of reloading the page
      refetchInvites();
    } catch (error: any) {
      console.error("Failed to invite organization:", error);
      if (error.data?.detail) {
        toast.error(error.data.detail);
      } else if (error.data?.code) {
        toast.error(`${error.data.code[0]}`);
      } else if (error.data?.error) {
        toast.error(`${error.data.error}`);
      } else {
        toast.error("Failed to invite organization. Please try again.");
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with back button and action buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <Button
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 -ml-3 self-start"
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>

          <div className="flex flex-col md:flex-row gap-3">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Organization
            </Button>

            {program?.is_active && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => setIsArchiveDialogOpen(true)}
                disabled={isArchiving}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive Program
              </Button>
            )}
          </div>
        </div>

        {/* Program header */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-sm mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3"></div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-blue-100">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                  {getInitials(program?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h1 className="text-2xl font-semibold text-blue-800">
                    {program?.name || "Program Details"}
                  </h1>

                  {program?.is_active ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 self-start">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200 self-start">
                      <XCircle className="mr-1 h-3 w-3" />
                      Archived
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-gray-600">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-blue-500" />
                    <span>
                      {program?.organization?.name || "Unknown Organization"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Created: {formatDate(program?.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700">
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization Name</span>
                  <span className="font-medium text-blue-900">
                    {program?.organization?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization Code</span>
                  <span className="font-medium text-blue-900">
                    {program?.organization?.code || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Organization Status</span>
                  {program?.organization?.is_active ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700">
                Program Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">
                      Created on {formatDate(program?.created_at)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      by{" "}
                      {program?.created_by?.name ||
                        program?.created_by?.email ||
                        "Unknown User"}
                    </div>
                  </div>
                </div>

                {program?.archived_at && (
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                    <Archive className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-900">
                        Archived on {formatDate(program?.archived_at)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        by{" "}
                        {program?.archived_by?.name ||
                          program?.archived_by?.email ||
                          "Unknown User"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Created by details */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-700">Created By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border border-blue-100">
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {getInitials(program?.created_by?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-blue-900">
                  {program?.created_by?.name || "Unnamed User"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {program?.created_by?.email || "No email provided"}
                </div>
                {program?.created_by?.phone && (
                  <div className="text-sm text-gray-600">
                    {program?.created_by?.phone}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Invitations */}
        <ProgramInvites programId={program?.id} />
      </div>

      {/* Standard dialog for archive confirmation */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{"Archive Program"}</DialogTitle>
            <DialogDescription>
              {
                "Are you sure you want to archive this program? This will make it inactive."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsArchiveDialogOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleArchiveProgram}
              className={
                program?.is_active
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }
              disabled={isArchiving}
            >
              {isArchiving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Archive"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for inviting organization */}
      <Dialog
        open={isInviteDialogOpen}
        onOpenChange={(open) => {
          setIsInviteDialogOpen(open);
          if (!open) {
            setOrganizationCode("");
            setCodeError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Organization</DialogTitle>
            <DialogDescription>
              Enter the organization code to invite them to this program.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInviteOrganization} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Organization Code
              </label>
              <Input
                id="code"
                placeholder="Enter organization code"
                className="border-blue-200 focus-visible:ring-blue-500"
                value={organizationCode}
                onChange={(e) => {
                  setOrganizationCode(e.target.value);
                  if (e.target.value.trim()) {
                    setCodeError("");
                  }
                }}
                required
              />
              {codeError && <p className="text-sm text-red-500">{codeError}</p>}
            </div>

            <DialogFooter className="sm:justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsInviteDialogOpen(false);
                  setOrganizationCode("");
                  setCodeError("");
                }}
                disabled={isInviting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isInviting}
              >
                {isInviting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  "Invite"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewProgram;
