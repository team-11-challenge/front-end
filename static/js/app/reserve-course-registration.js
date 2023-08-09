$(document).ready(function () {
    getCoursesFromBasket();
});

function logout() {
    localStorage.removeItem("Authorization");
    // location.replace("메인페이지 주소")
}

function search_class() {
    const year = 2022;
    const semester = 1;
    const subjectCd = $("#subject-code").text();
    const depart = $("#depart option:selected").text();
    const sort = $("#sort option:selected").text();

    const searchUrl = "http://localhost:8080/api/courses"
    const params = {  // 필요한 query params를 {} 형태에 담아준다.
        year: year,
        semester: semester,
        subjectCd: subjectCd,
        depart: depart,
        sort: sort
    };

    const queryString = new URLSearchParams(params).toString();
    const requrl = `${searchUrl}?${queryString}`;

    console.log(requrl);

    fetch(requrl, {
        method: "GET"
    })
        .then((response) => response.json())
        .then((result) => {
                if (result.success) {
                    $('#search-list').empty();

                    result.data.forEach(element => {
                        const courseId = element.courseId;
                        const collegeName = element.collegeName;
                        const departmentName = element.departmentName == null ? '-' : element.departmentName;
                        const majorName = element.majorName  == null ? '-' : element.majorName;
                        const sort = element.sort;
                        const subjectCd = element.subjectCd;
                        const division = element.division;
                        const subjectName = element.subjectName;
                        const credit = element.credit;
                        const professorName = element.professorName;
                        const timetable = element.timetable;
                        const limitation = element.limitation;
                        const numberOfCurrent = element.numberOfCurrent;


                        let temp = `
                            <tr>
                                <td>${collegeName}</td>
                                <td>${departmentName}</td>
                                <td>${majorName}</td>
                                <td>${sort}</td>
                                <td>${subjectCd}</td>
                                <td>${division}</td>
                                <td>${subjectName}</td>
                                <td>${credit}</td>
                                <td>${professorName}</td>
                                <td>${timetable}</td>
                                <td>${limitation}</td>
                                <td>${numberOfCurrent}</td>
                                <td>
                                    <button type="button" class="btn btn-primary btn-sm" onclick="registerToBasket(${courseId})">신청</button>
                                </td>
                            </tr>
                            `
                        $('#search-list').append(temp)
                    })
                } else {
                    console.log("조회 데이터 없음")
                }
            }
        )
        .catch(error => {
            console.error("조회 api 에러", error);
        });
}


function registerToBasket(courseId) {
    let url = "http://localhost:8080/api/basket/" + courseId;
    let token = localStorage.getItem("Authorization");
    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": token
        },
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert(result.msg);
            location.reload();
        } else {
            alert(result.errors);
        }
    });
}

function cancelFromBasket(basketId) {
    let url = "http://localhost:8080/api/basket/" + basketId;
    let token = localStorage.getItem("Authorization");
    fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": token
        },
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert(result.msg);
            location.reload();
        } else {
            alert(result.errors);
        }
    });
}

function getCoursesFromBasket() {
    let url = "http://localhost:8080/api/basket";
    let token = localStorage.getItem("Authorization");
    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": token
        },
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result.success) {
            $('#basket-list').empty();

            result.data.forEach(element => {
                const basketId = element.basketId;
                const collegeName = element.collegeName;
                const departmentName = element.departmentName == null ? '-' : element.departmentName;
                const majorName = element.majorName  == null ? '-' : element.majorName;
                const sort = element.sort;
                const subjectCode = element.subjectCd;
                const division = element.division;
                const subjectName = element.subjectName;
                const credit = element.credit;
                const professorName = element.professorName;
                const timetable = element.timetable;
                const limitation = element.limitation;
                const numberOfBasket = element.numberOfBasket;

                let temp = `
                    <tr>
                        <td>${collegeName}</td>
                        <td>${departmentName}</td>
                        <td>${majorName}</td>
                        <td>${sort}</td>
                        <td>${subjectCode}</td>
                        <td>${division}</td>
                        <td>${subjectName}</td>
                        <td>${credit}</td>
                        <td>${professorName}</td>
                        <td>${timetable}</td>
                        <td>${limitation}</td>
                        <td>${numberOfBasket}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-sm" onclick="cancelFromBasket(${basketId})">취소</button>
                        </td>
                    </tr>
                    `
                $('#basket-list').append(temp)
            })
        } else {
            console.log(result.errors)
        }
    });

}