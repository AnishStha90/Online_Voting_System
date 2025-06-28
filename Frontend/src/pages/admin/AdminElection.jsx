import React, { useState, useEffect } from 'react';
import { getAllParties } from '../../api/partyApi';
import { createElection } from '../../api/electionApi';
import { getMembersByParty } from '../../api/partyMemberApi';

const AdminElection = () => {
  const [parties, setParties] = useState([]);
  const [membersByParty, setMembersByParty] = useState({});

  const [form, setForm] = useState({
    title: '',
    startDate: '',
    endDate: '',
    posts: [
      {
        name: '',
        candidates: [{ party: '', member: '' }],
      },
    ],
  });

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const data = await getAllParties();
        setParties(data);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchParties();
  }, []);

  const handleCandidateChange = async (postIndex, candidateIndex, field, value) => {
    const updatedPosts = [...form.posts];
    updatedPosts[postIndex].candidates[candidateIndex][field] = value;

    if (field === 'party') {
      updatedPosts[postIndex].candidates[candidateIndex].member = '';

      if (value && !membersByParty[value]) {
        try {
          const members = await getMembersByParty(value);
          setMembersByParty((prev) => ({ ...prev, [value]: members }));
        } catch (error) {
          console.error('Failed to fetch members:', error);
        }
      }
    }

    setForm({ ...form, posts: updatedPosts });
  };

  const handlePostChange = (index, field, value) => {
    const updatedPosts = [...form.posts];
    updatedPosts[index][field] = value;
    setForm({ ...form, posts: updatedPosts });
  };

  const removePost = (postIndex) => {
    const updatedPosts = form.posts.filter((_, i) => i !== postIndex);
    setForm({ ...form, posts: updatedPosts });
  };

  const removeCandidate = (postIndex, candidateIndex) => {
    const updatedPosts = [...form.posts];
    updatedPosts[postIndex].candidates = updatedPosts[postIndex].candidates.filter(
      (_, i) => i !== candidateIndex
    );
    setForm({ ...form, posts: updatedPosts });
  };

  const addPost = () => {
    setForm({
      ...form,
      posts: [...form.posts, { name: '', candidates: [{ party: '', member: '' }] }],
    });
  };

  const addCandidate = (postIndex) => {
    const updatedPosts = [...form.posts];
    updatedPosts[postIndex].candidates.push({ party: '', member: '' });
    setForm({ ...form, posts: updatedPosts });
  };

  const submitForm = async () => {
    try {
      console.log('Submitting election:', form);
      await createElection(form);
      alert('Election created successfully');

      // Reset form after success
      setForm({
        title: '',
        startDate: '',
        endDate: '',
        posts: [
          {
            name: '',
            candidates: [{ party: '', member: '' }],
          },
        ],
      });
      setMembersByParty({});
    } catch (error) {
      console.error('Create election error:', error);
      alert('Failed to create election. Check console for details.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Election</h2>

      <input
        placeholder="Election Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {form.posts.map((post, postIndex) => (
        <div
          key={postIndex}
          className="bg-gray-100 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm relative"
        >
          <button
            onClick={() => removePost(postIndex)}
            className="absolute top-2 right-3 text-red-600 font-bold text-xl hover:text-red-800"
            title="Remove Post"
            type="button"
          >
            &times;
          </button>

          <input
            placeholder="Post Name"
            value={post.name}
            onChange={(e) => handlePostChange(postIndex, 'name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {post.candidates.map((candidate, candidateIndex) => (
            <div key={candidateIndex} className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <select
                value={candidate.party}
                onChange={(e) =>
                  handleCandidateChange(postIndex, candidateIndex, 'party', e.target.value)
                }
                className="w-full sm:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Party</option>
                {parties.map((party) => (
                  <option key={party._id} value={party._id}>
                    {party.name}
                  </option>
                ))}
              </select>

              <select
                value={candidate.member}
                onChange={(e) =>
                  handleCandidateChange(postIndex, candidateIndex, 'member', e.target.value)
                }
                disabled={!candidate.party}
                className={`w-full sm:w-1/3 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  candidate.party
                    ? 'border-gray-300 focus:ring-blue-400'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
              >
                <option value="">Select Member</option>
                {candidate.party &&
                  membersByParty[candidate.party]
                    ?.filter((member) => {
                      return (
                        !form.posts.some((p, pIdx) =>
                          p.candidates.some((c, cIdx) =>
                            (pIdx !== postIndex || cIdx !== candidateIndex) &&
                            c.member === member._id
                          )
                        ) || member._id === candidate.member
                      );
                    })
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
              </select>

              <button
                onClick={() => removeCandidate(postIndex, candidateIndex)}
                className="text-red-600 hover:text-red-800 font-bold text-xl focus:outline-none"
                title="Remove Candidate"
                type="button"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            onClick={() => addCandidate(postIndex)}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-shadow shadow-sm"
            type="button"
          >
            + Add Candidate
          </button>
        </div>
      ))}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={addPost}
          className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-5 py-2 transition-shadow shadow-sm"
          type="button"
        >
          + Add Post
        </button>
        <button
          onClick={submitForm}
          className="bg-black hover:bg-gray-900 text-white font-medium rounded-lg px-5 py-2 transition-shadow shadow-sm"
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AdminElection;
