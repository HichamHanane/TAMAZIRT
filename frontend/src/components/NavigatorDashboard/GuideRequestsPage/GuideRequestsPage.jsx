
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import './GuideRequestsPage.css';
import { getNavigatorRequests, update_status_reset, updateRequestStatus } from '../../../feature/RequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import default_image from '../../../assets/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_.avif'
import { toast } from 'sonner';




const GuideRequestsPage = () => {
    const dispatch = useDispatch()
    const { requests, isLoading, error } = useSelector(state => state.requests.navigator)
    const { status_update } = useSelector(state => state.requests)



    const handleUpdateStatus = async ({ request, status }) => {
        // setStatusValue(status)
        console.log('status value before dipatching :', status);
        console.log('id value before dipatching :', request.id);
        console.log("clicked");


        try {
            let result = await dispatch(updateRequestStatus({ id: request.id, status }));
            if (result.meta.requestStatus === "fulfilled") {
                toast.success('Your Response sent to the Tourist')
                dispatch(update_status_reset());
            }
        } catch (error) {
            console.log('Error while dispatch update navigator status function :', error);

        }
    }

    useEffect(() => {
        dispatch(getNavigatorRequests())
    }, [dispatch, status_update.statusUpdated])


    if (isLoading) {
        return (
            <div className="g-req-container" style={{ textAlign: 'center', padding: '50px' }}>
                <Loader2 size={30} className="g-req-loader-spin" />
                <p>Loading trip requests...</p>
            </div>
        );
    }






    return (
        <div className="g-req-container">
            <div className="g-req-header">
                <h1 className="g-req-title">Trip Requests</h1>
                <p className="g-req-subtitle">Review and respond to incoming requests from tourists.</p>
            </div>

            <div className="g-req-list">
                {requests?.length > 0 ? (
                    requests?.map(request => (
                        <div key={request.id} className="g-req-card">
                            <div className="g-req-card-header">
                                <div className="g-req-tourist-info">
                                    <img src={request?.touristAvatar || default_image} alt={request?.touristName} className="g-req-tourist-avatar" />
                                    <div>
                                        {/* <h2 className="g-req-trip-title">{request?.tripTitle}</h2> */}
                                        <p className="g-req-from-tourist"> <b>Request from :</b> {request?.tourist?.name}</p>
                                    </div>
                                </div>
                                <span className="g-req-new-badge">{request?.status}</span>
                            </div>

                            {/* Détails du voyage */}
                            <div className="g-req-details-grid">
                                <div className="g-req-detail-item">
                                    <p className="g-req-detail-label">Destination</p>
                                    <p className="g-req-detail-value g-req-detail-destination">{request?.destination}</p>
                                </div>
                                <div className="g-req-detail-item">
                                    <p className="g-req-detail-label">Dates</p>
                                    <p className="g-req-detail-value">{request?.date}</p>
                                </div>
                                <div className="g-req-detail-item">
                                    <p className="g-req-detail-label">Number of Persons</p>
                                    <p className="g-req-detail-value">{request?.number_of_people}</p>
                                </div>
                            </div>

                            {/* Exigences spéciales */}
                            <div className="g-req-special-requirements">
                                <p className="g-req-detail-label">Tourist Message</p>
                                <p className="g-req-requirements-text">{request?.message}</p>
                            </div>

                            {/* Boutons d'action */}
                            <div className="g-req-actions">
                                {
                                    request?.status != 'HandOff' ?
                                        <button className="g-req-btn g-req-btn-decline" onClick={() => handleUpdateStatus({ request, status: "HandOff" })} disabled={status_update.isLoading}>
                                            Decline
                                        </button>
                                        : null
                                }

                                {
                                    request?.status != 'Confirmed'
                                        ?
                                        <button className="g-req-btn g-req-btn-accept" onClick={() => handleUpdateStatus({ request, status: "Confirmed" })} disabled={status_update.isLoading}>
                                            Accept
                                        </button>
                                        : null

                                }


                            </div>
                        </div>
                    ))
                ) : (
                    <p className="g-req-no-results">No trip requests found at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default GuideRequestsPage;