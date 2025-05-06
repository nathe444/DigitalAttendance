import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAllProgramsQuery } from "@/store/apis/orgAdmin/orgAdminApi";
import { Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function GetAllOrganizationPrograms() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const getInitials = (name: string) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleProgramClick = (programId: string) => {
    navigate(`/program/${programId}`);
  };

  const { data, isLoading, isError, refetch } = useGetAllProgramsQuery({
    organization_pk: organizationId || "",
    page,
    page_size: 10,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-blue-800 mb-1">
              Programs
            </h1>
            <p className="text-gray-600">All programs for this organization</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-blue-700">Loading programs...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-48 text-red-600">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <span>Failed to load programs. Please try again.</span>
              <Button
                variant="outline"
                className="mt-4 border-blue-200"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </div>
          ) : data?.results && data.results.length > 0 ? (
            <>
              {/* Table for desktop */}
              <table className="hidden md:table min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {data.results.map((program) => (
                    <tr
                      key={program.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-blue-900">
                        {program.name}
                      </td>
                      <td className="px-4 py-3 text-blue-700">
                        {program.organization.code}
                      </td>
                      <td className="px-4 py-3">
                        {program.is_active ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-blue-700">
                        {program.organization?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(program.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Card view for mobile */}
              <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                {data.results.map((program) => (
                  <div
                    key={program.id}
                    className="overflow-hidden border border-blue-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    onClick={() => handleProgramClick(program.id)}
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12 border-2 border-blue-100">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(program.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900">
                            {program.name}
                          </h3>
                          <div className="mt-2">
                            {program.is_active ? (
                              <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                                Active
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                                Archived
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-blue-500" />
                      </div>

                      <div className="mt-3 flex flex-col space-y-1.5">
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-blue-700">
                          <span>
                            <span className="font-medium">Code:</span>{" "}
                            {program.organization.code}
                          </span>
                          <span>
                            <span className="font-medium">Organization:</span>{" "}
                            {program.organization?.name || "-"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(program.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-blue-700">
              <span className="text-lg font-medium mb-2">
                No programs found
              </span>
              <span className="text-gray-500">
                There are no programs for this organization.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
