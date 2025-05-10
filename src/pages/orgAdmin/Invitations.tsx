import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useViewAllOrganizationsQuery } from "@/store/apis/orgSuperAdmin/orgSuperAdminApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useGetInvitationsQuery } from "@/store/apis/orgAdmin/orgAdminApi";

const Invitations = () => {
  const navigate = useNavigate();
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all organizations
  const {
    data: organizationsData,
    isLoading: isLoadingOrganizations,
    isError: isOrganizationsError,
  } = useViewAllOrganizationsQuery();

  // Fetch invitations for selected organization
  const {
    data: invitationsData,
    isLoading: isLoadingInvitations,
    isError: isInvitationsError,
  } = useGetInvitationsQuery(
    {
      organization_pk: selectedOrganization,
      page,
      page_size: pageSize,
    },
    { skip: !selectedOrganization }
  );

  // Check if the screen is mobile
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

  const handleViewInvitation = (inviteId: string) => {
    navigate(`/org-admin/invitation-details/${inviteId}`, {
      state: { inviteId, organizationId: selectedOrganization },
    });
  };

  if (isLoadingOrganizations) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-blue-500">Loading organizations...</span>
      </div>
    );
  }

  if (isOrganizationsError) {
    return (
      <div className="bg-red-50 text-red-800 p-4 rounded-lg">
        <p>Failed to load organizations. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6">
          Program Invitations
        </h1>

        {/* Organization Selection */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-blue-700">
              Select Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedOrganization}
              onValueChange={(value) => {
                setSelectedOrganization(value);
                setPage(1); // Reset to first page when changing organization
              }}
            >
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizationsData?.results.map((org: any) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Invitations List */}
        {selectedOrganization ? (
          isLoadingInvitations ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2 text-blue-500">Loading invitations...</span>
            </div>
          ) : isInvitationsError ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
              <p>Failed to load invitations. Please try again later.</p>
            </div>
          ) : !invitationsData || invitationsData.results.length === 0 ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">
                  Program Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  No invitations have been received for this organization.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">
                  Program Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isMobile ? (
                  // Mobile view - Cards
                  <div className="space-y-4">
                    {invitationsData.results.map((invite) => (
                      <Card
                        key={invite.id}
                        className="border border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() =>
                          handleViewInvitation(invite.id.toString())
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-blue-900">
                              {invite.program.name}
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
                            <span>
                              From: {invite.program.organization.name}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 flex items-center mb-1">
                            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                            <span>
                              Invited: {formatDate(invite.invited_at)}
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 flex items-center mb-3">
                            <span className="text-blue-500 mr-1">By:</span>
                            <span>{invite.invited_by?.name || "Unknown"}</span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 mt-2"
                          >
                            View Details
                            <ArrowRight className="h-3 w-3 ml-2" />
                          </Button>
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
                          <TableHead>Program</TableHead>
                          <TableHead>From Organization</TableHead>
                          <TableHead>Invited On</TableHead>
                          <TableHead>Invited By</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invitationsData.results.map((invite) => (
                          <TableRow
                            key={invite.id}
                            className="cursor-pointer hover:bg-blue-50"
                            onClick={() =>
                              handleViewInvitation(invite.id.toString())
                            }
                          >
                            <TableCell className="font-medium">
                              {invite.program.name}
                            </TableCell>
                            <TableCell>
                              {invite.program.organization.name}
                            </TableCell>
                            <TableCell>
                              {formatDate(invite.invited_at)}
                            </TableCell>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewInvitation(invite.id.toString());
                                }}
                              >
                                View
                                <ArrowRight className="h-3 w-3 ml-2" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination controls can be added here */}
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                Please select an organization to view invitations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Invitations;
