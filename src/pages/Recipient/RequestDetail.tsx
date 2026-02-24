import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, CheckCircle2, Circle, Loader2, XCircle, Droplets, Clock, MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const urgencyLabel: Record<string, string> = {
  critical: "🔴 Critical",
  high: "🔴 High",
  urgent: "🟠 Urgent",
  medium: "🟠 Medium",
  standard: "🟢 Standard",
  low: "🟢 Low",
};

const RecipientRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statusData, isLoading } = useQuery({
    queryKey: ["request-status", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiURL}/requests/${id}/status`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return data.data;
    },
    enabled: !!token && !!id,
    refetchInterval: 15000,
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.patch(`${apiURL}/requests/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipient-requests"] });
      queryClient.invalidateQueries({ queryKey: ["request-status", id] });
      toast({ title: "Request cancelled" });
      navigate("/recipient-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to cancel",
        description: error?.response?.data?.message ?? "Please try again.",
        variant: "destructive",
      });
    },
  });

  const request = statusData?.request ?? statusData;
  const timeline = statusData?.timeline ?? statusData?.statusHistory ?? [];
  const isCancellable = request && !["cancelled", "completed", "fulfilled"].includes(request.status);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/recipient-dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="font-heading font-semibold text-lg">Request Details</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !request ? (
          <div className="text-center py-16 text-muted-foreground">Request not found.</div>
        ) : (
          <>
            {/* Request Info */}
            <Card className="border-border/50 shadow-soft overflow-hidden">
              <div className="h-1.5 w-full gradient-warm" />
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full gradient-warm flex items-center justify-center">
                      <Droplets className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <h2 className="font-heading font-semibold text-xl">
                        {request.bloodType} – {request.unitsNeeded} unit(s)
                      </h2>
                      {request.patientName && (
                        <p className="text-muted-foreground text-sm">Patient: {request.patientName}</p>
                      )}
                    </div>
                  </div>
                  <Badge className="bg-destructive/15 text-destructive border-destructive/30">
                    {urgencyLabel[request.urgency] ?? request.urgency}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  {request.hospitalName && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{request.hospitalName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {request.medicalCondition && (
                  <p className="text-sm"><strong>Condition:</strong> {request.medicalCondition}</p>
                )}
                {request.notes && (
                  <p className="text-sm text-muted-foreground"><strong>Notes:</strong> {request.notes}</p>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className="capitalize">{request.status?.replace("_", " ")}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            {timeline.length > 0 && (
              <section>
                <h3 className="font-heading font-semibold text-lg mb-3">Status Timeline</h3>
                <Card className="border-border/50 shadow-soft">
                  <CardContent className="py-6">
                    <div className="space-y-0">
                      {timeline.map((step: any, i: number) => {
                        const isDone = step.done ?? step.completed ?? true;
                        return (
                          <div key={i} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              {isDone ? (
                                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground/30 shrink-0" />
                              )}
                              {i < timeline.length - 1 && (
                                <div className={`w-0.5 h-8 ${isDone ? "bg-primary/40" : "bg-border"}`} />
                              )}
                            </div>
                            <div className="-mt-0.5">
                              <p className={`text-sm font-medium ${isDone ? "text-foreground" : "text-muted-foreground/50"}`}>
                                {step.label ?? step.status ?? step.message}
                              </p>
                              {(step.time ?? step.timestamp ?? step.createdAt) && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(step.time ?? step.timestamp ?? step.createdAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Cancel Button */}
            {isCancellable && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Cancelling…</>
                ) : (
                  <><XCircle className="w-4 h-4 mr-1" /> Cancel Request</>
                )}
              </Button>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default RecipientRequestDetail;
