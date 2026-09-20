import React, {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import axios from "axios";

import { AuthContextData } from "../context/AuthContext";
import PostCard from "./PostCard";

function PostFeed() {

    const { serverUrl } = useContext(AuthContextData);

    const [posts, setPosts] = useState([]);

    const [nextCursor, setNextCursor] = useState(null);

    const [hasMore, setHasMore] = useState(true);

    const [loadingPosts, setLoadingPosts] = useState(false);

    const loadMoreRef = useRef(null);


    const getPost = async (cursor = null) => {

        try {

            if (
                loadingPosts ||
                (!hasMore && cursor)
            ) {
                return;
            }

            setLoadingPosts(true);

            let url =
                `${serverUrl}/v1/api/post/getPost?limit=10`;

            if (cursor) {

                url +=
                    `&cursor=${encodeURIComponent(cursor)}`;

            }

            const result = await axios.get(
                url,
                {
                    withCredentials: true
                }
            );

            const newPosts =
                result.data.posts;

            if (cursor) {

                setPosts((prev) => [
                    ...prev,
                    ...newPosts
                ]);

            } else {

                setPosts(newPosts);

            }

            setNextCursor(
                result.data.pagination.nextCursor
            );

            setHasMore(
                result.data.pagination.hasMore
            );

        } catch (error) {

            console.log(
                "Get post error:",
                error
            );

        } finally {

            setLoadingPosts(false);

        }
    };


    // Initial posts

    useEffect(() => {

        getPost();

    }, [serverUrl]);


    // Infinite scroll

    useEffect(() => {

        const observer =
            new IntersectionObserver(
                (entries) => {

                    const target =
                        entries[0];

                    if (
                        target.isIntersecting &&
                        hasMore &&
                        !loadingPosts &&
                        nextCursor
                    ) {

                        getPost(nextCursor);

                    }

                },
                {
                    root: null,
                    rootMargin: "200px",
                    threshold: 0
                }
            );


        const currentRef =
            loadMoreRef.current;

        if (currentRef) {

            observer.observe(currentRef);

        }


        return () => {

            if (currentRef) {

                observer.unobserve(
                    currentRef
                );

            }

        };

    }, [
        nextCursor,
        hasMore,
        loadingPosts
    ]);


    return (

        <div className="mt-5 flex flex-col gap-5">

            {posts.map((post) => (

                <PostCard
                    key={post._id}
                    post={post}
                />

            ))}


            {/* Sentinel */}

            <div
                ref={loadMoreRef}
                className="w-full flex justify-center py-6"
            >

                {loadingPosts && (

                    <p className="text-gray-500">
                        Loading posts...
                    </p>

                )}

                {!hasMore && posts.length > 0 && (

                    <p className="text-gray-500">
                        No more posts
                    </p>

                )}

            </div>

        </div>
    );
}

export default PostFeed;