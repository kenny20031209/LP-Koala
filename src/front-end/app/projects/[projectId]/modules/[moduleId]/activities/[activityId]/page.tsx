'use client';
import Cookies from "js-cookie";
import {use, useEffect, useState} from "react";
import he from "he";
import RateModal from '@/components/rate-modal';
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/utils";

interface Rating {
  rating: number;
  rater: {
      _id: string;
      name?: string;
      role?: string;
  }
}

const ActivityIdPage = ({
                          params
                        }: {
  params: { projectId: string; activityId: string }
}) => {

  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const openRateModal = () => setRateModalOpen(true);
  const closeRateModal = () => setRateModalOpen(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getActivity = async ()=> {
    try {
      const token = Cookies.get('token')!;

      const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/activity/${params.activityId}`,{
        method: "GET",
        headers: {
          "Authorization": token!
        }
      }).then(async r => {
        if (r.ok) {
          const result = await r.json();
          const activity = result.data.data;
          const decoded = he.decode(activity.content);
          setContent(decoded);
          setDescription(activity.description);
          setRatings(activity.ratings);
          console.log(activity.ratings);
        }
      });

    }catch (error){
      console.log(error)
    }
  }

  const fetchUser = async () => {
    const token = Cookies.get('token')!;
    if (token) {
      try {
        const user = await getCurrentUser(token);
        setCurrentUser(user);
        setUserRole(user.role);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    getActivity()
  }, [currentUser]);

  useEffect(() => {
    if(ratings.length>0 && currentUser) {
      setRatings(ratings.filter(rating => rating.rater._id === currentUser._id))
      const lastUserRating = ratings.length > 0 ? ratings[ratings.length - 1] : null;
      setRatings([lastUserRating]);
    }

  }, [currentUser]);

  
  const handleRateSubmit = async (rating: number) => {
    if (!currentUser) {
      console.error("No user data available.");
      return;
    }

    const token = Cookies.get('token')!;
    const raterId = currentUser.id;
    const response = await fetch(`https://lp-koala-backend-c0a69db0f618.herokuapp.com/activity/${params.activityId}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ 
            rater: raterId,
            rating: rating
       })
    });

    if (response.ok) {
      console.log("Rating submitted successfully");
    } else {
      console.error("Failed to submit rating");
    }

    closeRateModal();
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const stars = [];
  
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <Star
          key={i}
          color={i <= rating ? '#FFD700' : '#CCCCCC'}
          fill={i <= rating ? '#FFD700' : 'none'}
          style={{ display: 'inline-block', marginRight: '2px' }}
        />
      );
    }
  
    return stars;
  };

  const convertToCSV = (ratings: Rating[]): string => {
    const headers = "Rater ID, Rater Name, Rating";
    const rows = ratings.map(rating => `${rating.rater._id}, ${rating.rater.name}, ${rating.rating}`);
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csvString = convertToCSV(ratings);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `activity-${params.activityId}/ratings.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className='p-20'>
          <p className='text-center'>{description}</p>
          <div
              className='m-20 h-full '
              dangerouslySetInnerHTML={{ __html: content }}
              // style={{ wordBreak: "break-word" }}
          />
      </div>
      {/*{ratings.length > 0 && renderStars(ratings[0].rating)}<br></br><br></br>*/}
      {userRole == 'rater' && (
        <Button className='w-48' onClick={openRateModal}>
          <Star className="h-4 w-4 mr-2" />
          Rate
        </Button>
      )}
      {userRole !== 'rater' && (
        <Button className='w-48' onClick={downloadCSV}>
          Download Ratings
        </Button>
      )}
      {rateModalOpen && <RateModal isOpen={rateModalOpen} onClose={closeRateModal} onSubmit={handleRateSubmit} />}
    </>
  );
}

export default ActivityIdPage;