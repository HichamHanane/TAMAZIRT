import { useForm } from 'react-hook-form'; 
import * as yup from 'yup'; 
import { yupResolver } from '@hookform/resolvers/yup'; 
import './TouristRequestsPage.css';
import { useDispatch } from 'react-redux';



const editRequestSchema = yup.object().shape({
    destination: yup.string().required("Destination is required").min(3, "Destination must be at least 3 characters"),
    number_of_people: yup.number().typeError("Number of persons must be a number").required("Number of persons is required").min(1, "Must be at least 1 person"),
    date: yup.string().required("Date is required"), // On utilise un string pour le datepicker HTML5
    message: yup.string().max(500, "Message cannot exceed 500 characters"),
});



const EditRequestModal = ({ request, onClose }) => {
    const dispatch = useDispatch();
    const { isUpdating } = useSelector(state => state.requests.tourist); 

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(editRequestSchema),
        defaultValues: {
            destination: request.destination,
            number_of_people: request.number_of_people,
            date: request.date,
            message: request.message,
        }
    });

    const onSubmit = (data) => {
        dispatch(updateTouristRequest({ id: request.id, requestData: data }))
            .unwrap() 
            .then(() => {
                onClose(); 
            })
            .catch(() => {
                // Le toast d'erreur est déjà géré dans le thunk
            });
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${new Date(year, month - 1, day).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="t-modal-backdrop">
            <div className="t-edit-modal-content">
                <button className="t-modal-close-btn" onClick={onClose}><X size={20} /></button>

                <h3 className="t-modal-title">Edit Trip Request</h3>
                <p className="t-modal-subtitle-unique">
                    Modify the details for your trip to {request.destination}.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="t-edit-form">
                    <div className="t-form-group">
                        <label htmlFor="destination" className="t-form-label">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            {...register('destination')}
                            className="t-form-input"
                        />
                        {errors.destination && <p className="t-form-error">{errors.destination.message}</p>}
                    </div>

                    <div className="t-form-grid">
                        <div className="t-form-group">
                            <label htmlFor="number_of_people" className="t-form-label">Number of Persons</label>
                            <input
                                type="number"
                                id="number_of_people"
                                {...register('number_of_people')}
                                className="t-form-input"
                            />
                            {errors.number_of_people && <p className="t-form-error">{errors.number_of_people.message}</p>}
                        </div>

                        <div className="t-form-group">
                            <label htmlFor="date" className="t-form-label">Date</label>
                            <input
                                type="date"
                                id="date"
                                {...register('date')}
                                className="t-form-input"
                            />
                            {errors.date && <p className="t-form-error">{errors.date.message}</p>}
                        </div>
                    </div>

                    <div className="t-form-group">
                        <label htmlFor="message" className="t-form-label">Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            {...register('message')}
                            className="t-form-textarea"
                        ></textarea>
                        {errors.message && <p className="t-form-error">{errors.message.message}</p>}
                    </div>

                    <div className="t-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="t-action-btn t-modal-cancel-btn"
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="t-action-btn t-modal-save-btn"
                            disabled={isUpdating}
                        >
                            {isUpdating ? <Loader2 size={18} className="t-loader-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};