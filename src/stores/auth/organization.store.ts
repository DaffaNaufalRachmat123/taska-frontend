import { create, StateCreator } from "zustand";
import { ViewState } from "../../components/utilities/ViewState";
import axiosInstance from "../../configApi";
import { OrgResponse } from "../../interfaces/organization-inteface";


export interface OrganizationState {
    orgState: ViewState<OrgResponse>;
    org: () => Promise<void>;
    resetState: () => void
}

const storeOrganizationApi: StateCreator<OrganizationState> = (set) => ({
    orgState: { type: 'Idle' },
    org: async () => {
        try {
            set({
                orgState: {
                    type: 'Loading'
                }
            })

            // Simulate API call
            const { data } = await axiosInstance.get<OrgResponse>(`/v1/organizations/me`)
            set({
                orgState: {
                    type: 'Success',
                    data: data
                },
            });
        } catch (error) {
            console.error(error);
            set({
                orgState: {
                    type: 'Failed',
                    message: 'Failed to fetch organization data',
                    code: 500
                }
            });
        }
    },
    resetState: () => {
        set({
            orgState: { type: 'Idle' }
        });
    }
});

export const useOrganizationStore = create<OrganizationState>()(storeOrganizationApi);