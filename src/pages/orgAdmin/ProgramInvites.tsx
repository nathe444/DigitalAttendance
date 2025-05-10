import { useState, useEffect } from "react";
import {
  useGetInvitesQuery,
  useUndoInviteOrganizationMutation,
} from "@/store/apis/orgAdmin/orgAdminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building, Calendar, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProgramInvitesProps {
  programId: string;
}

const ProgramInvites = ({ programId }: ProgramInvitesProps) => {
  const {
    data: invitesData,
    isLoading,
    isError,
    refetch,
  } = useGetInvitesQuery(programId);
  const [undoInvite, { isLoading: isUndoing }] =
    useUndoInviteOrganizationMutation();
  const [undoingId, setUndoingId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  console.log(invitesData);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUndoInvite = async (inviteId: string) => {
    try {
      setUndoingId(inviteId);
      await undoInvite(inviteId).unwrap();
      toast.success("Invitation has been cancelled successfully");
      refetch();
    } catch (error: any) {
      console.error("Failed to undo invitation:", error);
      if (error.data?.detail) {
        toast.error(error.data.detail);
      } else {
        toast.error("Failed to cancel invitation. Please try again.");
      }
    } finally {
      setUndoingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-blue-500">Loading invitations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">
        <p>Failed to load invitations. Please try again later.</p>
      </div>
    );
  }

  if (!invitesData || invitesData.results.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-blue-700">
            Program Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            No invitations have been sent for this program yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-blue-700">
          Program Invitations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          // Mobile view - Cards
          <div className="space-y-4">
            {invitesData.results.map((invite) => (
              <Card key={invite.id} className="border border-blue-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-blue-900">
                      {invite.organization.name}
                    </div>
                    <Badge
                      className={
                        invite.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {invite.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center mb-1">
                    <Building className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Code: {invite.organization.code}</span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Invited: {formatDate(invite.invited_at)}</span>
                  </div>

                  <div className="text-sm text-gray-600 flex items-center mb-3">
                    <span className="text-blue-500 mr-1">By:</span>
                    <span>{invite.invited_by?.name || "Unknown"}</span>
                  </div>

                  {invite.is_active && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleUndoInvite(invite.id.toString())}
                      disabled={isUndoing && undoingId === invite.id.toString()}
                    >
                      {isUndoing && undoingId === invite.id.toString() ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-2" />
                          Cancel Invitation
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Desktop view - Table
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Invited On</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitesData.results.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">
                      {invite.organization.name}
                    </TableCell>
                    <TableCell>{invite.organization.code}</TableCell>
                    <TableCell>{formatDate(invite.invited_at)}</TableCell>
                    <TableCell>
                      {invite.invited_by?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          invite.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {invite.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invite.is_active && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleUndoInvite(invite.id.toString())}
                          disabled={
                            isUndoing && undoingId === invite.id.toString()
                          }
                        >
                          {isUndoing && undoingId === invite.id.toString() ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-2" />
                              Cancel Invitation
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgramInvites;
