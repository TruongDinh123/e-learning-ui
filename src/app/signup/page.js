"use client";
import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import Link from "next/link";
import {AiOutlineMail} from "react-icons/ai";
import {RiLockPasswordLine} from "react-icons/ri";
import {MdOutlinePhone} from "react-icons/md";
import {RiHome4Line} from "react-icons/ri";
import {MdOutlinePermIdentity} from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { TbUserSearch } from "react-icons/tb";
import { TbUserShield } from "react-icons/tb";


import {useDispatch} from "react-redux";
import {useFormik} from "formik";
import {registerUser} from "@/features/User/userSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import * as yup from "yup";
import {message} from "antd";
import {useRouter} from "next/navigation";
import {BsEye, BsEyeSlash} from "react-icons/bs";
import {useEffect, useState} from "react";

const registerSchema = yup.object({
    email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Yêu cầu nhập email"),
    password: yup
        .string()
        .min(6, "Password phải có ít nhất 6 kí tự")
        .required("Yêu cầu nhập mật khẩu"),
    phone: yup
        .string()
        .min(6, "Password phải có ít nhất 6 kí tự")
        .required("Yêu cầu nhập mật khẩu"),

    cmnd: yup
        .string()
        .min(6, "Password phải có ít nhất 6 kí tự")
        .required("Yêu cầu nhập mật khẩu"),

    address: yup
        .string()
        .min(6, "Password phải có ít nhất 6 kí tự")
        .required("Yêu cầu nhập mật khẩu"),

    // unit: yup
    //     .string()
    //     .min(6, "Password phải có ít nhất 6 kí tự")
    //     .required("Yêu cầu nhập mật khẩu"),
});

const options = {
    "Cấp tỉnh": [
        "-Sở Nội vụ",
        "-Sở Nông nghiệp và Phát triển nông thôn",
        "-Đoàn khối Cơ quan – Doanh nghiệp tỉnh",
        "-Sở Lao động, Thương Binh và Xã hội",
        "-Sở Khoa học và Công nghệ",
        "-Ủy ban Mặt trận Tổ quốc Việt Nam tỉnh",
        "-Sở Giao thông vận tải",
        "-Sở Kế hoạch và Đầu tư",
        "-Sở Tài Chính",
        "-Sở Tài Nguyên và Môi trường",
        "-Sở Y tế",
        "-Thanh tra tỉnh",
        "-Tỉnh đoàn",
        "-Sở Xây dựng",
        "-Đài Phát thanh và Truyền hình Bến Tre",
        "-Sở Thông tin và Truyền thông",
        "-Sở Văn hóa, Thể thao và Du lịch",
        "-Sở Giáo dục và Đào tạo",
        "-Hội Liên hiệp phụ nữ tỉnh",
        "-Hội nông dân tỉnh",
        "-Hiệp hội doanh nghiệp tỉnh",
        "-Công an tỉnh",
        "-Liên Đoàn lao động tỉnh",
        "-Bảo hiểm xã hội tỉnh",
        "-Bộ Chỉ huy quân sự tỉnh",
        "-Sở Công Thương",
    ],
    "Cấp huyện": {
        "-Huyện Mỏ Cày Nam": [
            "--Huyện đoàn Mỏ Cày Nam",
            "--Hội phụ nữ huyện Mỏ Cày Nam",
            "--Công an huyện Mỏ Cày Nam",
            "--Tòa án nhân dân huyện Mỏ Cày Nam",
            "--Ủy ban Mặt trận Tổ quốc huyện Mỏ Cày Nam",
            "--Viện Kiểm sát nhân dân huyện Mỏ Cày Nam",
            "--Ủy ban nhân dân huyện Mỏ Cày Nam",
        ],
        "-Huyện Mỏ Cày Bắc": [
            "--Công an huyện Mỏ Cày Bắc",
            "--Hội phụ nữ huyện Mỏ Cày Bắc",
            "--Huyện đoàn Mỏ Cày Bắc",
            "--Tòa án nhân dân huyện Mỏ Cày Bắc",
            "--Ủy ban Mặt trận Tổ quốc huyện Mỏ Cày Bắc",
            "--Ủy ban nhân dân huyện Mỏ Cày Bắc",
            "--Viện Kiểm sát nhân dân huyện Mỏ Cày Bắc",

        ],
        "-Huyện Châu Thành": [
            "--Công an huyện Châu Thành",
            "--Hội phụ nữ huyện Châu Thành",
            "--Huyện đoàn Châu Thành",
            "--Tòa án nhân dân huyện Châu Thành",
            "--Ủy ban Mặt trận Tổ quốc huyện Châu Thành",
            "--Ủy ban nhân dân huyện Châu Thành",
            "--Viện Kiểm sát nhân dân huyện Châu Thành",
        ],
        "-Huyện Chợ Lách": [
            "--Công an huyện Chợ Lách",
            "--Hội phụ nữ huyện Chợ Lách",
            "--Huyện đoàn Chợ Lách",
            "--Tòa án nhân dân huyện Chợ Lách",
            "--Ủy ban Mặt trận Tổ quốc huyện Chợ Lách",
            "--Ủy ban nhân dân huyện Chợ Lách",
            "--Viện Kiểm sát nhân dân huyện Chợ Lách",
        ],
        "-Huyện Bình Đại": [
            "--Công an huyện Bình Đại",
            "--Hội phụ nữ huyện Bình Đại",
            "--Huyện đoàn Bình Đại",
            "--Tòa án nhân dân huyện Bình Đại",
            "--Ủy ban Mặt trận Tổ quốc huyện Bình Đại",
            "--Ủy ban nhân dân huyện Bình Đại",
            "--Viện Kiểm sát nhân dân huyện Bình Đại",
        ],
        "-Huyện Giồng Trôm": [
            "--Công an huyện Giồng Trôm",
            "--Hội phụ nữ huyện Giồng Trôm",
            "--Huyện đoàn Giồng Trôm",
            "--Tòa án nhân dân huyện Giồng Trôm",
            "--Ủy ban Mặt trận Tổ quốc huyện Giồng Trôm",
            "--Ủy ban nhân dân huyện Giồng Trôm",
            "--Viện Kiểm sát nhân dân huyện Giồng Trôm",
        ],
        "-Huyện Thạnh Phú": [
            "--Công an huyện Thạnh Phú",
            "--Hội phụ nữ huyện Thạnh Phú",
            "--Huyện đoàn Thạnh Phú",
            "--Tòa án nhân dân huyện Thạnh Phú",
            "--Ủy ban Mặt trận Tổ quốc huyện Thạnh Phú",
            "--Ủy ban nhân dân huyện Thạnh Phú",
            "--Viện Kiểm sát nhân dân huyện Thạnh Phú",
        ],
        "-Thành phố Bến Tre": [
            "--Công an Thành phố Bến Tre",
            "--Hội phụ nữ Thành phố Bến Tre",
            "--Huyện đoàn Thành phố Bến Tre",
            "--Tòa án nhân dân Thành phố Bến Tre",
            "--Ủy ban Mặt trận Tổ quốc Thành phố Bến Tre",
            "--Ủy ban nhân dân Thành phố Bến Tre",
            "--Viện Kiểm sát nhân dân Thành phố Bến Tre",
        ],
        "-Huyện Ba Tri": [
            "--Công an huyện Ba Tri",
            "--Hội phụ nữ huyện Ba Tri",
            "--Huyện đoàn Ba Tri",
            "--Tòa án nhân dân huyện Ba Tri",
            "--Ủy ban Mặt trận Tổ quốc huyện Ba Tri",
            "--Ủy ban nhân dân huyện Ba Tri",
            "--Viện Kiểm sát nhân dân huyện Ba Tri",
        ],
    },
    "Cấp xã": []
}


export default function SignUp() {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");


    const [selectedCap, setSelectedCap] = useState('');
    const [selectedDonVi, setSelectedDonVi] = useState('');
    const [donViOptions, setDonViOptions] = useState([]);
    const [subUnits, setSubUnits] = useState([]);
    const [donViCon, setDonViCon] = useState('');

    useEffect(() => {
        if (selectedCap === "Cấp tỉnh") {
            setDonViOptions(options["Cấp tỉnh"]);
            formik.handleChange("cap")
        } else if (selectedCap === "Cấp huyện") {
            setDonViOptions(Object.keys(options["Cấp huyện"]));
        } else {
            setDonViOptions([]);
        }
        setSelectedDonVi('');
        setSubUnits([]);
    }, [selectedCap]);


    useEffect(() => {
        if (selectedCap === "Cấp huyện") {
            setSubUnits(options["Cấp huyện"][selectedDonVi] || []);
        } else {
            setSubUnits([]);
        }
    }, [selectedDonVi, selectedCap]);


    const formik = useFormik({
        validationSchema: registerSchema,
        initialValues: {
            email: "",
            password: "",
            address: "",
            cmnd: "",
            phone: "",
            cap: "",
            donvi: "",
            donvicon: "",
            lastName: "",
            firstName: "",
        },
        onSubmit: (values) => {
            values.cap = selectedCap;
            values.donvi = selectedDonVi;
            values.donvicon = donViCon;

            console.log(values)


            if(values.password && values.email) {
              dispatch(registerUser(values))
              .then(unwrapResult)
              .then((res) => {
                if(res.user){
                  messageApi
                      .open({
                        type: "Thành công",
                        content: "Đăng ký thành công",
                        duration: 1,
                      })
                      .then(() => message.info("Di chuyển qua trang đăng nhập", 1))
                      .then(() => {
                        router.push("/login");
                      });
                } else {
                  messageApi
                      .open({
                        type: "Thất bại",
                        content: res.message ?? "Có lỗi xảy ra",
                        duration: 2,
                      })
                }

              });
            }

        },
    });

    return (
        <div
            className="min-h-screen relative bg-no-repeat bg-cover bg-center
      flex items-center justify-center"
            style={{
                backgroundImage:
                    "url(https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg)",
            }}
        >
            {contextHolder}
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
                <div className="md:w-1/2 text-center md:text-left p-8">
                    <h1 className="text-4xl font-bold mb-4">
                        <Link href="/">
                            <p className="hover:no-underline hover:text-[#007bff]">
                                EXAM-ONE
                            </p>
                        </Link>
                    </h1>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md">
                    <h1 className="text-3xl font-bold p-2">Đăng ký tài khoản</h1>
                    <form
                        action="signup"
                        onSubmit={formik.handleSubmit}
                        className="p-4  rounded"
                    >
                        <div className="flex flex-col space-y-4 mb-6">
                            <label className="flex flex-col" htmlFor="email">
                                <span className="text-sm font-medium">Email</span>
                                <CustomInput
                                    prefix={<AiOutlineMail/>}
                                    placeholder="Địa chỉ email"
                                    onChange={formik.handleChange("email")}
                                    onBlur={formik.handleBlur("email")}
                                    value={formik.values.email}
                                    error={formik.touched.email && formik.errors.email}
                                />
                            </label>

                            <label className="flex flex-col" htmlFor="password">
                                <span className="text-sm font-medium">Mật khẩu</span>
                                <CustomInput
                                    prefix={<RiLockPasswordLine/>}
                                    suffix={
                                        showPassword ? (
                                            <BsEyeSlash
                                                onClick={() => setShowPassword(false)}
                                                style={{cursor: "pointer"}}
                                            />
                                        ) : (
                                            <BsEye
                                                onClick={() => setShowPassword(true)}
                                                style={{cursor: "pointer"}}
                                            />
                                        )
                                    }
                                    placeholder="Mật khẩu"
                                    onBlur={formik.handleBlur("password")}
                                    onChange={(e) => {
                                        formik.handleChange("password")(e);
                                        setPasswordValue(e.target.value);
                                    }}
                                    value={passwordValue}
                                    error={formik.touched.password && formik.errors.password}
                                    type={showPassword ? "text" : "password"}
                                />
                            </label>


                            <label className="flex flex-col" htmlFor="fistName">
                                <span className="text-sm font-medium">Họ và tên</span>
                                <div className="flex justify-content-around">
                                    <CustomInput
                                        prefix={<TbUserSearch/>}
                                        placeholder="Nhập họ"
                                        onChange={formik.handleChange("lastName")}
                                        onBlur={formik.handleBlur("lastName")}
                                        value={formik.values.lastName}
                                        error={formik.touched.lastName && formik.errors.lastName}
                                        required
                                        className="mr-1"
                                    />
                                    <CustomInput
                                        prefix={<TbUserShield/>}
                                        placeholder="Nhập tên"
                                        onChange={formik.handleChange("firstName")}
                                        onBlur={formik.handleBlur("firstName")}
                                        value={formik.values.firstName}
                                        error={formik.touched.firstName && formik.errors.firstName}
                                        required
                                    />
                                </div>


                            </label>

                            <label className="flex flex-col" htmlFor="phone">
                                <span className="text-sm font-medium">Số Điện Thoại</span>
                                <CustomInput
                                    prefix={<MdOutlinePhone/>}
                                    placeholder="Nhập số điện thoại"
                                    onChange={formik.handleChange("phone")}
                                    onBlur={formik.handleBlur("phone")}
                                    value={formik.values.phone}
                                    error={formik.touched.phone && formik.errors.phone}
                                    required
                                />
                            </label>


                            <label className="flex flex-col" htmlFor="cmnd">
                                <span className="text-sm font-medium">CMND/CCCD</span>
                                <CustomInput
                                    prefix={<MdOutlinePermIdentity/>}
                                    placeholder="Nhập số CMND/CCCD"
                                    onChange={formik.handleChange("cmnd")}
                                    onBlur={formik.handleBlur("cmnd")}
                                    value={formik.values.cmnd}
                                    error={formik.touched.cmnd && formik.errors.cmnd}
                                />
                            </label>

                            <label className="flex flex-col" htmlFor="adress">
                                <span className="text-sm font-medium">Địa chỉ</span>
                                <CustomInput
                                    prefix={<RiHome4Line/>}
                                    placeholder="Địa chỉ cụ thể"
                                    onChange={formik.handleChange("address")}
                                    onBlur={formik.handleBlur("address")}
                                    value={formik.values.address}
                                    error={formik.touched.address && formik.errors.address}
                                    required
                                />
                            </label>


                            <span className="text-sm font-medium">Đơn vị công tác</span>

                            <label className="flex flex-col" htmlFor="cap">
                                <select value={selectedCap}
                                        onChange={e =>  setSelectedCap(e.target.value)}>
                                    <option value="">Chọn Cấp</option>
                                    <option value="Cấp tỉnh">Cấp tỉnh</option>cd
                                    <option value="Cấp huyện">Cấp huyện</option>
                                    <option value="Cấp xã">Cấp xã</option>
                                </select>

                            </label>
                            <label className="flex flex-col" htmlFor="donvi">
                                {
                                    selectedCap && selectedCap !== "Cấp xã" && (
                                        <select className="mt-2" value={selectedDonVi}
                                                onChange={e => setSelectedDonVi(e.target.value)} disabled={!selectedCap}>
                                            <option value="">Chọn đơn vị</option>
                                            {donViOptions.map(unit => (
                                                <option key={unit} value={unit}>{unit.replace(/^-+/, '')}</option>
                                            ))}
                                        </select>
                                    )
                                }
                            </label>
                            <label className="flex flex-col" htmlFor="donvicon">
                                {
                                    selectedDonVi && subUnits.length !== 0 &&
                                    (
                                        <select className="mt-2" disabled={!selectedDonVi || subUnits.length === 0}
                                                onChange={e => setDonViCon(e.target.value)}>
                                            <option value="">Chọn đơn vị con</option>
                                            {subUnits.map(subUnit => (
                                                <option key={subUnit}
                                                        value={subUnit}>{subUnit.replace(/^-+/, '')}</option>
                                            ))}
                                        </select>)
                                }
                            </label>

                        </div>

                        <CustomButton
                            title="Đăng ký"
                            type="primary"
                            className="py-1 px-8 bg-blue-900 hover:bg-blue-400 mt-5
                text-white text-center inline-block text-lg
                my-1 mx-1 rounded-lg cursor-pointer border-none w-full"
                        />

                        <div className="mt-2 mb-2">
                            <Link href="/login">
                <span
                    className="text-xs text-blue-800  hover:text-blue-800"
                >
                  Bạn đã có tài khoản? <b>Đăng nhập</b>
                </span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
